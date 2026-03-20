<?php
/**
 * DataForge Infrastructure — CORS Proxy
 * Usage: /proxy.php?s=SERVICE[&path=/sub/path]
 * Services: wazuh, grafana, prometheus, alertmanager, adminer, ldap
 *
 * Strategy: curl follows redirects internally (FOLLOWLOCATION),
 * then injects <base href> into HTML so the browser loads
 * all assets directly from the correct backend (valid cert or SSL bypass).
 *
 * Direct backends (no tunnel needed — Plesk server, ports open):
 *   wazuh   → https://195.35.28.51:8444/
 *   adminer → http://195.35.28.51:8081/
 *   ldap    → http://195.35.28.51:8085/
 *
 * Tunnel backends (Oracle private network via Cloudflare Tunnel):
 *   grafana/prometheus/alertmanager → CF tunnel on VM1
 */

// Cloudflare tunnel for Oracle private network services
$CF = 'https://kenny-jun-list-hay.trycloudflare.com';

$BACKENDS = [
    'wazuh'        => 'https://195.35.28.51:8444',
    'adminer'      => 'http://195.35.28.51:8081',
    'ldap'         => 'http://195.35.28.51:8085',
    'grafana'      => $CF . '/grafana',
    'prometheus'   => $CF . '/prometheus',
    'alertmanager' => $CF . '/alertmanager',
];

// --- Parse request ---------------------------------------------------------
$service = $_GET['s'] ?? '';
$subpath = $_GET['path'] ?? '/';
if (!$subpath || $subpath[0] !== '/') $subpath = '/' . $subpath;

// Also support path-based routing via .htaccess
if (!$service) {
    if (preg_match('#/proxy/([a-z]+)(/.*)#', $_SERVER['REQUEST_URI'], $m)) {
        $service = $m[1]; $subpath = $m[2] ?? '/';
    }
}

if (!$service || !isset($BACKENDS[$service])) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Use ?s=wazuh|grafana|prometheus|alertmanager|adminer|ldap']);
    exit;
}

// Pass through extra query params (except s, path)
$extra = $_GET;
unset($extra['s'], $extra['path']);
$qs = $extra ? '?' . http_build_query($extra) : '';

$target = $BACKENDS[$service] . $subpath . $qs;
$method = $_SERVER['REQUEST_METHOD'];
$body   = in_array($method, ['POST','PUT','PATCH']) ? file_get_contents('php://input') : null;

// --- Forward headers -------------------------------------------------------
$skip    = ['HOST','ACCEPT-ENCODING','CONNECTION','TRANSFER-ENCODING'];
$headers = [];
foreach ($_SERVER as $k => $v) {
    if (strpos($k, 'HTTP_') === 0) {
        $name = str_replace('_', '-', substr($k, 5));
        if (!in_array($name, $skip)) $headers[] = "$name: $v";
    }
}
if (!empty($_SERVER['CONTENT_TYPE']))   $headers[] = 'Content-Type: '   . $_SERVER['CONTENT_TYPE'];
if (!empty($_SERVER['CONTENT_LENGTH'])) $headers[] = 'Content-Length: ' . $_SERVER['CONTENT_LENGTH'];

// --- Execute ---------------------------------------------------------------
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL             => $target,
    CURLOPT_RETURNTRANSFER  => true,
    CURLOPT_HEADER          => true,
    CURLOPT_FOLLOWLOCATION  => true,   // follow redirects internally
    CURLOPT_MAXREDIRS       => 8,
    CURLOPT_SSL_VERIFYPEER  => false,
    CURLOPT_SSL_VERIFYHOST  => false,
    CURLOPT_CUSTOMREQUEST   => $method,
    CURLOPT_HTTPHEADER      => $headers,
    CURLOPT_POSTFIELDS      => $body,
    CURLOPT_TIMEOUT         => 30,
    CURLOPT_CONNECTTIMEOUT  => 10,
]);

$raw     = curl_exec($ch);
$errno   = curl_errno($ch);
$hSize   = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$status  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$finalUrl= curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
curl_close($ch);

if ($errno || $raw === false) {
    http_response_code(502);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Backend unreachable', 'service' => $service, 'target' => $target]);
    exit;
}

$respHeaders = substr($raw, 0, $hSize);
$respBody    = substr($raw, $hSize);

// --- Forward safe headers --------------------------------------------------
$contentType = '';
$safe = ['content-type','cache-control','last-modified','etag','set-cookie','content-disposition'];
foreach (explode("\r\n", $respHeaders) as $h) {
    if (!$h || stripos($h, 'HTTP/') === 0) continue;
    [$name, $val] = array_pad(explode(':', $h, 2), 2, '');
    $nameLower = strtolower(trim($name));
    if ($nameLower === 'content-type') $contentType = strtolower(trim($val));
    if (in_array($nameLower, $safe)) header($h, false);
}

// --- Inject <base href> into HTML so browser loads assets from CF tunnel ---
if (strpos($contentType, 'text/html') !== false) {
    // Use final URL (after redirects) as base so relative paths resolve correctly
    $base = $finalUrl ?: ($BACKENDS[$service] . '/');
    if (substr($base, -1) !== '/') $base = dirname($base) . '/';
    $baseTag = '<base href="' . htmlspecialchars($base, ENT_QUOTES) . '">';

    // Inject right after <head> (or prepend if no <head>)
    if (preg_match('/<head[^>]*>/i', $respBody)) {
        $respBody = preg_replace('/(<head[^>]*>)/i', '$1' . $baseTag, $respBody, 1);
    } else {
        $respBody = $baseTag . $respBody;
    }
}

// Allow iframe embedding
header('X-Frame-Options: ALLOWALL');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Content-Security-Policy: frame-ancestors *');

http_response_code($status ?: 200);
echo $respBody;
