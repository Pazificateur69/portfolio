<?php
/**
 * DataForge Infrastructure — Reverse Proxy
 * Usage: /proxy.php?s=SERVICE  (no .htaccess needed)
 * Services: wazuh, grafana, prometheus, alertmanager, adminer, ldap
 */

// Cloudflare Tunnel (valid HTTPS, no cert warning)
// Run on VM1: /tmp/cloudflared tunnel --url http://localhost
$CF = 'https://bless-graphs-bibliographic-nickname.trycloudflare.com';

$BACKENDS = [
    'wazuh'        => $CF . '/wazuh',
    'grafana'      => $CF . '/grafana',
    'prometheus'   => $CF . '/prometheus',
    'alertmanager' => $CF . '/alertmanager',
    'adminer'      => $CF . '/adminer',
    'ldap'         => $CF . '/ldap',
];

// Parse service from ?s= param OR path-based URL via .htaccess
$service = $_GET['s'] ?? '';
$subpath = $_GET['path'] ?? '/';

if (!$service) {
    $uri = strtok($_SERVER['REQUEST_URI'], '?');
    if (preg_match('#/proxy/([a-z]+)(/.*)#', $uri, $m)) {
        $service = $m[1];
        $subpath = $m[2] ?? '/';
    }
}

if (!$service || !isset($BACKENDS[$service])) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Use ?s=wazuh|grafana|prometheus|alertmanager|adminer|ldap']);
    exit;
}

// Pass through all query params except s and path
$params = $_GET;
unset($params['s'], $params['path']);
$qs = $params ? '?' . http_build_query($params) : '';

$target = $BACKENDS[$service] . $subpath . $qs;
$method = $_SERVER['REQUEST_METHOD'];
$body   = in_array($method, ['POST','PUT','PATCH']) ? file_get_contents('php://input') : null;

// Forward headers (skip hop-by-hop)
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

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL            => $target,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER         => true,
    CURLOPT_FOLLOWLOCATION => false,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_SSL_VERIFYHOST => false,
    CURLOPT_CUSTOMREQUEST  => $method,
    CURLOPT_HTTPHEADER     => $headers,
    CURLOPT_POSTFIELDS     => $body,
    CURLOPT_TIMEOUT        => 30,
    CURLOPT_CONNECTTIMEOUT => 10,
]);

$raw    = curl_exec($ch);
$errno  = curl_errno($ch);
$hSize  = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($errno || $raw === false) {
    http_response_code(502);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Backend unreachable', 'service' => $service, 'target' => $target]);
    exit;
}

$respHeaders = substr($raw, 0, $hSize);
$respBody    = substr($raw, $hSize);

// Rewrite Location headers to stay inside proxy
if (preg_match('/^Location:\s*(.+)$/mi', $respHeaders, $loc)) {
    $location = trim($loc[1]);
    foreach ($BACKENDS as $svc => $backend) {
        if (strpos($location, $backend) === 0) {
            $newPath = urlencode(substr($location, strlen($backend)));
            header("Location: /proxy.php?s=$svc&path=$newPath", true, $status ?: 302);
            exit;
        }
    }
    header("Location: $location", true, $status ?: 302);
    exit;
}

// Forward safe headers
$safe = ['content-type','cache-control','last-modified','etag','set-cookie','content-disposition'];
foreach (explode("\r\n", $respHeaders) as $h) {
    if (!$h || stripos($h, 'HTTP/') === 0) continue;
    [$name] = explode(':', $h, 2);
    if (in_array(strtolower(trim($name)), $safe)) header($h, false);
}

header('X-Frame-Options: ALLOWALL');
header('Access-Control-Allow-Origin: https://pazent.fr');
header('Content-Security-Policy: frame-ancestors *');

http_response_code($status ?: 200);
echo $respBody;
