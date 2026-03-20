#!/bin/bash
set -e

echo "🚀 Setting up DataForge Proxy Server on pazent.fr..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "Installing Node.js v18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo bash -
    sudo apt-get install -y nodejs
fi

# Setup proxy
cd /home/u736310720
mkdir -p proxy-server
cd proxy-server

# Copy proxy server
cp ../portfolio/proxy-server.js .

# Create package.json
cat > package.json << 'EOF'
{
  "name": "dataforge-proxy",
  "version": "1.0.0",
  "main": "proxy-server.js",
  "scripts": { "start": "node proxy-server.js" }
}
EOF

# Install & start
npm install 2>/dev/null || true
pkill -f "node proxy-server" || true
sleep 1

nohup node proxy-server.js > /tmp/proxy.log 2>&1 &
sleep 2

# Test
if curl -s http://localhost:3001/proxy/grafana | head -c 50 > /dev/null; then
    echo "✓ Proxy server running on port 3001"
else
    echo "⚠️ Proxy may still be starting..."
    cat /tmp/proxy.log
fi

# Setup nginx
echo "Configuring Nginx reverse proxy..."
sudo tee /etc/nginx/conf.d/proxy.conf > /dev/null << 'NGINX'
server {
    listen 80;
    server_name pazent.fr www.pazent.fr;

    location /proxy/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_buffering off;
        proxy_request_buffering off;
    }
}
NGINX

sudo nginx -t && sudo systemctl restart nginx
echo "✓ Nginx configured"
echo ""
echo "✅ Setup complete! Dashboard at: https://pazent.fr/infra-dashboard/"

