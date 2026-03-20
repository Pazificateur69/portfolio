#!/bin/bash
# DataForge Infrastructure Proxy Setup
# Run on pazent.fr Hostinger: bash ~/portfolio/setup-proxy.sh

set -e
WEBROOT="$HOME/domains/pazent.fr/public_html"

echo "=== DataForge Proxy Setup ==="

# 1. Deploy proxy.php
cp "$(dirname "$0")/proxy.php" "$WEBROOT/proxy.php"
echo "[+] proxy.php deployed"

# 2. Update .htaccess to route /proxy/* to proxy.php
HTACCESS="$WEBROOT/.htaccess"
# Remove any old proxy rules first
sed -i '/# DATAFORGE PROXY/,/# END DATAFORGE PROXY/d' "$HTACCESS" 2>/dev/null || true

# Prepend proxy rules (before existing rules)
TMP=$(mktemp)
cat > "$TMP" << 'HTEOF'
# DATAFORGE PROXY
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteRule ^proxy/([a-z]+)(/.*)? /proxy.php [L,QSA]
</IfModule>
# END DATAFORGE PROXY
HTEOF
cat "$HTACCESS" >> "$TMP" 2>/dev/null || true
mv "$TMP" "$HTACCESS"
echo "[+] .htaccess updated"

# 3. Set permissions
chmod 644 "$WEBROOT/proxy.php"
chmod 644 "$WEBROOT/.htaccess"
echo "[+] Permissions set"

# 4. Quick test
echo ""
echo "=== Testing proxy ==="
curl -sk "https://pazent.fr/proxy/prometheus/-/healthy" | head -3 && echo " Prometheus OK" || echo " Prometheus: check VM3"
curl -sk "https://pazent.fr/proxy/grafana/api/health" | python3 -c "import sys,json; d=json.load(sys.stdin); print(' Grafana', d.get('database','?'))" 2>/dev/null || echo " Grafana: check VM3"

echo ""
echo "=== Done ==="
echo "Proxy available at https://pazent.fr/proxy/SERVICE/PATH"
echo "Services: wazuh, grafana, prometheus, alertmanager, adminer, ldap"
