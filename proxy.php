<?php
/**
 * DataForge Infrastructure — Reverse Proxy
 * Deployed by setup-proxy.sh on pazent.fr (Hostinger/LiteSpeed)
 * Routes /proxy/SERVICE/PATH → VM1 nginx → backend services
 */

$BACKENDS = [
    'wazuh'        => 'https://82.70.248.117/wazuh',
    'grafana'      => 'https://82.70.248.117/grafana',
    'prometheus'   => 'https://82.70.248.117/prometheus',
    'alertmanager' => 'https://82.70.248.117/alertmanager',
    'adminer'      => 'https://82.70.248.117/adminer',
    'ldap'         => 'https://82.70.248.117/ldap',
];

// Parse /proxy/SERVICE/PATH from REQUEST_URI
$uri = strtok($_SERVER['REQUEST_URI'], '?');
if (!preg_match('#^/proxy/([a-z]+)(/.*)?$#', $uri, $m)) {
    http_response_code(404); exit('Not found');
}
$service = $m[1];
$path    = $m[2] ?? '/';
$qs      = $_SERVER['QUERY_STRING'] ? '?' . $_SERVER['QUERY_STRING'] : '';

if (!isset($BACKENDS[$service])) {
    http_response_code(404); exit('Unknown service');
}

$target = $BACKENDS[$service] . $path . $qs;
$method = $_SERVER['REQUEST_METHOD'];
$body   = in_array($method, ['POST','PUT','PATCH']) ? file_get_contents('php://input') : null;

// Build forward headers
$skip    = ['HOST','ACCEPT-ENCODING','CONNECTION','TRANSFER-ENCODING'];
$headers = ['X-Forwarded-For: ' . ($_SERVER['REMOTE_ADDR'] ?? '')];
foreach ($_SERVER as $k => $v) {
    if (strpos($k, 'HTTP_') === 0) {
        $name = str_replace('_', '-', substr($k, 5));
        if (!in_array($name, $skip)) $headers[] = "$name: $v";
    }
}
if (!empty($_SERVER['CONTENT_TYPE']))   $headers[] = 'Content-Type: ' . $_SERVER['CONTENT_TYPE'];
if (!empty($_SERVER['CONTENT_LENGTH'])) $headers[] = 'Content-Length: ' . $_SERVER['CONTENT_LENGTH'];

// Execute request via cURL
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

$raw        = curl_exec($ch);
$errno      = curl_errno($ch);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$status     = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($errno || $raw === false) {
    http_response_code(502);
    echo json_encode(['error' => 'Proxy error', 'service' => $service, 'target' => $target]);
    exit;
}

$respHeaders = substr($raw, 0, $headerSize);
$respBody    = substr($raw, $headerSize);

// Forward safe response headers
$fwd = ['content-type','cache-control','set-cookie','last-modified','etag','content-disposition'];
foreach (explode("\r\n", $respHeaders) as $h) {
    if (!$h || strpos($h, 'HTTP/') === 0) continue;
    [$name] = explode(':', $h, 2);
    if (in_array(strtolower(trim($name)), $fwd)) header($h, false);
}

// Handle redirects: rewrite Location headers to stay within proxy
preg_match('/^Location:\s*(.+)$/mi', $respHeaders, $loc);
if ($loc) {
    $location = trim($loc[1]);
    foreach ($BACKENDS as $svc => $backend) {
        if (strpos($location, $backend) === 0) {
            $newPath = substr($location, strlen($backend));
            header("Location: /proxy/$svc$newPath", true, $status);
            exit;
        }
    }
}

// Allow embedding from pazent.fr
header('X-Frame-Options: ALLOWALL');
header('Access-Control-Allow-Origin: https://pazent.fr');
header('Access-Control-Allow-Credentials: true');

http_response_code($status);
echo $respBody;
