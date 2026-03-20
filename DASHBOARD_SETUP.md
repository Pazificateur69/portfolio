# DataForge Infrastructure Dashboard — Setup Guide

## ✅ Already Deployed
- Dashboard UI: `https://pazent.fr/infra-dashboard/`
- Password: `DataForge@Infra2025`
- GitHub: commit `66767fa`

## 🔄 Proxy Server Setup (One-Time)

To display live dashboards (Wazuh, Grafana, LDAP, etc.) inside the browser, you need to activate the proxy server.

### Option 1: Automatic Setup (Recommended)

On **pazent.fr** server:
```bash
ssh -p 65002 u736310720@82.25.113.36
cd portfolio
bash setup-proxy.sh
```

This will:
1. Install Node.js (if needed)
2. Start proxy server on port 3001
3. Configure Nginx to forward `/proxy/` requests
4. Test the setup

### Option 2: Manual Setup

```bash
# SSH into pazent.fr
ssh -p 65002 u736310720@82.25.113.36

# Create proxy directory
mkdir -p ~/proxy-server
cd ~/proxy-server

# Copy proxy server code
cp ~/portfolio/proxy-server.js .

# Create package.json
cat > package.json << 'EOF'
{
  "name": "dataforge-proxy",
  "version": "1.0.0",
  "main": "proxy-server.js"
}
EOF

# Install and start
npm init -y
nohup node proxy-server.js > /tmp/proxy.log 2>&1 &

# Configure Nginx (ask hosting support or use Plesk control panel)
# Add reverse proxy: /proxy/ → http://127.0.0.1:3001
```

## 🧪 Testing

After setup:

```bash
# Test proxy is running
curl http://127.0.0.1:3001/proxy/grafana | head -c 100

# Visit dashboard
https://pazent.fr/infra-dashboard/
# Password: DataForge@Infra2025
# Click any service card → should display in iframe
```

## 📊 Services Available

Once proxy is active, these will display in the dashboard:

| Service | Port | URL |
|---------|------|-----|
| Wazuh Dashboard | 8444 | `https://195.35.28.51:8444` |
| Grafana | 3000 | `http://10.0.1.20:3000` |
| Adminer | 8081 | `http://195.35.28.51:8081` |
| phpLDAPadmin | 8085 | `http://195.35.28.51:8085` |
| Prometheus | 9090 | `http://10.0.1.20:9090` |
| Alertmanager | 9093 | `http://10.0.1.20:9093` |

## 🔐 Default Credentials

- **Wazuh**: `admin` / `DataForge2025!`
- **Grafana**: `admin` / `DataForge2025!`
- **LDAP Admin**: `cn=admin,dc=dataforge,dc=lab` / `Admin@DataForge2025!`

## 📝 Troubleshooting

### Proxy not starting
```bash
cat /tmp/proxy.log
ps aux | grep "node proxy"
```

### Nginx reverse proxy not working
```bash
sudo nginx -t  # test config
sudo systemctl restart nginx
```

### Services showing in iframe but not loading
- Check: Services must be accessible from pazent.fr (they are)
- Some may require HTTPS (Wazuh) — proxy handles this
- Dashboard should timeout gracefully if service is down

## 🚀 After Setup

The dashboard will fully work:
- Click service cards to open them in iframe
- All interaction is transparent (proxy forwards everything)
- Credentials displayed in side panel for SSH access alternative

---

**Commit**: `66767fa`  
**Last Updated**: 2026-03-20 13:35 UTC
