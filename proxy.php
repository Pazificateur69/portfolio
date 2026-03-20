<?php
/**
 * DataForge Infrastructure Proxy
 * Forward requests to internal services (195.35.28.51, 10.0.1.20)
 * Usage: /proxy/wazuh/, /proxy/grafana/, etc.
 */

$services = [
    'wazuh'        => ['host' => '195.35.28.51', 'port' => 8444, 'scheme' => 'https'],
    'grafana'      => ['host' => '10.0.1.20', 'port' => 3000, 'scheme' => 'http'],
    'adminer'      => ['host' => '195.35.28.51', 'port' => 8081, 'scheme' => 'http'],
    'ldap'         => ['host' => '195.35.28.51', 'port' => 8085, 'scheme' => 'http'],
    'prometheus'   => ['host' => '10.0.1.20', 'port' => 9090, 'scheme' => 'http'],
    'alertmanager' => ['host' => '10.0.1.20', 'port' => 9093, 'scheme' => 'http']
];

// Parse URL
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
preg_match('#^/proxy/([a-z]+)(/.*)?$#', $path, $matches);

if (!$matches) {
    http_response_code(404);
    die('Not found');
}

$service_name = $matches[1];
$service_path = $matches[2] ?? '/';

if (!isset($services[$service_name])) {
    http_response_code(404);
    die('Service not found');
}

$service = $services[$service_name];
$url = sprintf(
    '%s://%s:%d%s',
    $service['scheme'],
    $service['host'],
    $service['port'],
    $service_path
);

// Add query string
if (!empty($_SERVER['QUERY_STRING'])) {
    $url .= '?' . $_SERVER['QUERY_STRING'];
}

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, HEAD');
header('Access-Control-Allow-Headers: *');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Prepare cURL request
$ch = curl_init($url);

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => false,
    CURLOPT_BINARYTRANSFER => true,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_SSL_VERIFYHOST => false,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 300,
    CURLOPT_CONNECTTIMEOUT => 30,
    CURLOPT_CUSTOMREQUEST => $_SERVER['REQUEST_METHOD'],
    CURLOPT_HTTPHEADER => getRequestHeaders(),
    CURLOPT_HEADER => true,
    CURLOPT_VERBOSE => false,
]);

// Handle request body
if (in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT', 'PATCH'])) {
    $body = file_get_contents('php://input');
    curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
}

// Execute
$response = curl_exec($ch);
$info = curl_getinfo($ch);

if (curl_errno($ch)) {
    http_response_code(502);
    die('Bad Gateway: ' . curl_error($ch));
}

curl_close($ch);

// Parse response headers and body
list($headers, $body) = explode("\r\n\r\n", $response, 2);

// Forward response headers
$header_lines = explode("\r\n", $headers);
foreach ($header_lines as $line) {
    if (!empty($line) && !preg_match('#^(Transfer-Encoding|Content-Encoding|Connection):#i', $line)) {
        header($line);
    }
}

// Set status code
http_response_code($info['http_code']);

// Send body
echo $body;

function getRequestHeaders() {
    $headers = [];
    
    foreach ($_SERVER as $key => $value) {
        if (strpos($key, 'HTTP_') === 0) {
            $header = str_replace('_', '-', substr($key, 5));
            // Skip headers we don't want to forward
            if (!in_array($header, ['HOST', 'CONNECTION', 'CONTENT-LENGTH'])) {
                $headers[$header] = $value;
            }
        }
    }
    
    // Add computed headers
    if (!empty($_SERVER['CONTENT_TYPE'])) {
        $headers['Content-Type'] = $_SERVER['CONTENT_TYPE'];
    }
    if (!empty($_SERVER['CONTENT_LENGTH'])) {
        $headers['Content-Length'] = $_SERVER['CONTENT_LENGTH'];
    }
    
    return $headers;
}
?>
