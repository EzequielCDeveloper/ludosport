#!/usr/bin/env bash
# Ludo Sport Drake Academy — VPS deploy
# Usage: ./deploy/deploy.sh <vps-host> [vps-user] [remote-path]
#
# Examples:
#   ./deploy/deploy.sh 192.168.1.100
#   ./deploy/deploy.sh myserver.com root /var/www/ludosport

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

echo "✅ Deploy complete — https://ludosport.com"
echo ""
echo "Next steps on the VPS:"
echo "  1. Copy nginx config:"
echo "     scp deploy/ludosport.nginx.conf ${VPS_USER}@${VPS_HOST}:/etc/nginx/sites-available/ludosport"
echo "  2. Enable site:"
echo "     ssh ${VPS_USER}@${VPS_HOST} 'ln -sf /etc/nginx/sites-available/ludosport /etc/nginx/sites-enabled/ && nginx -t && systemctl reload nginx'"
echo "  3. Get HTTPS:"
echo "     ssh ${VPS_USER}@${VPS_HOST} 'certbot --nginx -d ludosport.com -d www.ludosport.com'"
echo "  4. Uncomment HTTPS section in nginx config and reload"
