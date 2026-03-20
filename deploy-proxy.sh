#!/bin/bash
# Quick deploy script for DataForge Proxy on pazent.fr
# Usage: bash deploy-proxy.sh

set -e

SERVER="82.25.113.36"
PORT="65002"
USER="u736310720"
SSH_KEY="${SSH_KEY:=$HOME/.ssh/id_ed25519}"

echo "🚀 Deploying DataForge Proxy to pazent.fr..."

# Copy files
echo "📦 Uploading files..."
scp -P $PORT -i $SSH_KEY proxy-server.js $USER@$SERVER:~/proxy-server/
scp -P $PORT -i $SSH_KEY package.json $USER@$SERVER:~/proxy-server/

# Start proxy
echo "🔄 Starting proxy server..."
ssh -p $PORT -i $SSH_KEY $USER@$SERVER << 'REMOTE'
cd ~/proxy-server
npm init -y 2>/dev/null || true
pkill -f "node proxy-server" 2>/dev/null || true
sleep 1
nohup node proxy-server.js > /tmp/proxy.log 2>&1 &
sleep 2

# Test
if curl -s http://127.0.0.1:3001/proxy/grafana 2>&1 | grep -q "html\|<!"; then
  echo "✅ Proxy is running!"
  echo "   Test: curl http://127.0.0.1:3001/proxy/grafana"
  echo "   URL: https://pazent.fr/proxy/grafana/"
else
  echo "⚠️ Proxy may still be starting..."
  tail -20 /tmp/proxy.log
fi
REMOTE

echo ""
echo "✅ Deployment complete!"
echo "   Dashboard: https://pazent.fr/infra-dashboard/"
echo "   Services will load via /proxy/ endpoint"
echo ""
echo "To configure Nginx, add this to your domain config:"
echo "  location /proxy/ {"
echo "    proxy_pass http://127.0.0.1:3001;"
echo "    proxy_http_version 1.1;"
echo "    proxy_set_header Upgrade \$http_upgrade;"
echo "    proxy_set_header Connection \"upgrade\";"
echo "    proxy_buffering off;"
echo "  }"
