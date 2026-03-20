/**
 * Cloudflare Worker - DataForge Proxy
 * Deploy: wrangler deploy
 * Usage: https://your-worker.workers.dev/?s=grafana
 */

const SERVICES = {
  'wazuh': { host: '195.35.28.51', port: 8444, protocol: 'https' },
  'grafana': { host: '10.0.1.20', port: 3000, protocol: 'http' },
  'adminer': { host: '195.35.28.51', port: 8081, protocol: 'http' },
  'ldap': { host: '195.35.28.51', port: 8085, protocol: 'http' },
  'prometheus': { host: '10.0.1.20', port: 9090, protocol: 'http' },
  'alertmanager': { host: '10.0.1.20', port: 9093, protocol: 'http' }
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const serviceName = url.searchParams.get('s');
    const service = SERVICES[serviceName];

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
      'Access-Control-Allow-Headers': '*'
    };

    if (request.method === 'OPTIONS') {
      return new Response('OK', { headers: corsHeaders });
    }

    if (!service) {
      return new Response('Service not found', { status: 404, headers: corsHeaders });
    }

    const targetUrl = `${service.protocol}://${service.host}:${service.port}/`;

    try {
      const response = await fetch(targetUrl, {
        method: request.method,
        headers: {
          ...Object.fromEntries(request.headers),
          'Host': `${service.host}:${service.port}`
        },
        body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined
      });

      const newResponse = new Response(response.body, response);
      
      // Add CORS headers
      newResponse.headers.set('Access-Control-Allow-Origin', '*');
      newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
      
      return newResponse;
    } catch (error) {
      return new Response(`Error: ${error.message}`, { status: 502, headers: corsHeaders });
    }
  }
};
