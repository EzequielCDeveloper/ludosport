#!/usr/bin/env bash
# Ludo Sport Drake Academy — VPS deploy (Cloudflare proxy)
# Usage: ./deploy/deploy.sh <vps-host> [vps-user] [remote-path]
#
# Prerequisites on the VPS:
#   1. nginx installed:  apt install nginx -y
#   2. Origin CA cert at: /etc/nginx/ssl/ludosport.com.pem
#   3. Origin CA key at:   /etc/nginx/ssl/ludosport.com.key
#
# Get the cert from: Cloudflare Dashboard → SSL/TLS → Origin Server → Create Certificate
# Save the .pem and .key files, then upload them once:
#   ssh root@<vps> 'mkdir -p /etc/nginx/ssl'
#   scp ludosport.com.pem root@<vps>:/etc/nginx/ssl/
#   scp ludosport.com.key root@<vps>:/etc/nginx/ssl/
#   ssh root@<vps> 'chmod 600 /etc/nginx/ssl/ludosport.com.key'

set -euo pipefail

VPS_HOST="${1:?Usage: ./deploy/deploy.sh <vps-host> [vps-user] [remote-path]}"
VPS_USER="${2:-root}"
REMOTE_PATH="${3:-/var/www/ludosport}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo "🔨 Building static export..."
npm run build

echo "📦 Syncing to ${VPS_USER}@${VPS_HOST}:${REMOTE_PATH} ..."
rsync -avz --delete \
    --exclude='.DS_Store' \
    out/ \
    "${VPS_USER}@${VPS_HOST}:${REMOTE_PATH}/"

echo ""
echo "✅ Deploy complete — https://ludosport.com"
echo ""
echo "─── Cloudflare SSL/TLS checklist ───"
echo "Dashboard → SSL/TLS → Overview: set to 'Full (strict)'"
echo ""
echo "If this is the first deploy, run these ONCE on the VPS:"
echo ""
echo "  1. Upload Origin CA certificate:"
echo "     ssh ${VPS_USER}@${VPS_HOST} 'mkdir -p /etc/nginx/ssl'"
echo "     scp ludosport.com.pem ${VPS_USER}@${VPS_HOST}:/etc/nginx/ssl/"
echo "     scp ludosport.com.key ${VPS_USER}@${VPS_HOST}:/etc/nginx/ssl/"
echo "     ssh ${VPS_USER}@${VPS_HOST} 'chmod 600 /etc/nginx/ssl/ludosport.com.key'"
echo ""
echo "  2. Install nginx config:"
echo "     scp deploy/ludosport.nginx.conf ${VPS_USER}@${VPS_HOST}:/etc/nginx/sites-available/ludosport"
echo "     ssh ${VPS_USER}@${VPS_HOST} 'ln -sf /etc/nginx/sites-available/ludosport /etc/nginx/sites-enabled/ && rm -f /etc/nginx/sites-enabled/default && nginx -t && systemctl reload nginx'"
echo ""
echo "  3. (Optional) Restrict to Cloudflare IPs only:"
echo "     ssh ${VPS_USER}@${VPS_HOST} 'curl -s https://www.cloudflare.com/ips-v4/ | sed \"s/^/allow /; s/\$/;/\" > /etc/nginx/cloudflare-allow.conf && echo \"deny all;\" >> /etc/nginx/cloudflare-allow.conf'"
echo "     Then uncomment the 'include /etc/nginx/cloudflare-allow.conf;' and 'deny all;' lines in the nginx config"
