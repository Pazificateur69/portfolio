// Simple HTTPS proxy for DataForge infrastructure services
// Usage: node proxy-server.js
// Proxies private services (195.35.28.51) through public endpoint

const https = require('https');
const http = require('http');
const fs = require('fs');
const url = require('url');

const PROXY_PORT = 3001;
const SERVICES = {
  'wazuh': { host: '195.35.28.51', port: 8444, protocol: 'https' },
  'grafana': { host: '10.0.1.20', port: 3000, protocol: 'http' },
  'adminer': { host: '195.35.28.51', port: 8081, protocol: 'http' },
  'ldap': { host: '195.35.28.51', port: 8085, protocol: 'http' },
  'prometheus': { host: '10.0.1.20', port: 9090, protocol: 'http' },
  'alertmanager': { host: '10.0.1.20', port: 9093, protocol: 'http' }
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Extract service name and target path
  const match = pathname.match(/^\/proxy\/([a-z]+)(\/.*)?$/);
  if (!match) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const serviceName = match[1];
  const targetPath = match[2] || '/';
  const service = SERVICES[serviceName];

  if (!service) {
    res.writeHead(404);
    res.end('Service not found');
    return;
  }

  console.log(`Proxying ${serviceName}: ${service.protocol}://${service.host}:${service.port}${targetPath}`);

  // Create proxy request
  const proxyUrl = `${service.protocol}://${service.host}:${service.port}${targetPath}${pathname.includes('?') ? '?' + parsedUrl.search : ''}`;
  const proxyClient = service.protocol === 'https' ? https : http;

  const proxyReq = proxyClient.request(proxyUrl, {
    method: req.method,
    headers: {
      ...req.headers,
      'Host': `${service.host}:${service.port}`
    },
    rejectUnauthorized: false // Self-signed certs
  }, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error('Proxy error:', err);
    res.writeHead(502);
    res.end('Bad Gateway: ' + err.message);
  });

  req.pipe(proxyReq);
});

server.listen(PROXY_PORT, () => {
  console.log(`\n✓ DataForge Proxy Server running on port ${PROXY_PORT}`);
  console.log(`  Services available at: http://localhost:${PROXY_PORT}/proxy/{service}`);
  console.log(`  Services: ${Object.keys(SERVICES).join(', ')}\n`);
});

process.on('SIGTERM', () => {
  console.log('Shutting down...');
  server.close();
});
