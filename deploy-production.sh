#!/bin/bash

# Production deployment script for MCP Server Chart MinIO
# This script helps configure the external MinIO endpoint for Docker deployment

echo "🚀 MCP Server Chart MinIO - Production Deployment Setup"
echo "======================================================="

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install it first."
    exit 1
fi

# Get server IP address
read -p "Enter your server's IP address (e.g., 192.168.1.100): " SERVER_IP

if [ -z "$SERVER_IP" ]; then
    echo "❌ Server IP is required. Exiting."
    exit 1
fi

# Validate IP format (basic validation)
if [[ ! $SERVER_IP =~ ^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$ ]]; then
    echo "⚠️  Warning: '$SERVER_IP' doesn't look like a valid IP address."
    read -p "Continue anyway? (y/N): " CONTINUE
    if [[ ! $CONTINUE =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "📝 Configuration Summary:"
echo "  Server IP: $SERVER_IP"
echo "  API URL: http://$SERVER_IP:3000"
echo "  MinIO Console: http://$SERVER_IP:9001"
echo ""

# Create production environment file
cat > .env.production << EOF
# Production Docker Deployment Configuration
PORT=3000
HOST=0.0.0.0
NODE_ENV=production
PUBLIC_API_URL=http://$SERVER_IP:3000

# MinIO Connection for the app
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin

# Bucket settings
MINIO_BUCKET_NAME=charts
MINIO_AUTO_CREATE_BUCKET=false

# MinIO External Access Configuration
MINIO_EXTERNAL_ENDPOINT=$SERVER_IP
MINIO_EXTERNAL_PORT=9000

# MinIO server admin (used by Docker minio service)
# Change these in production if needed
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin
EOF

echo "✅ Created .env.production file"

# Deploy with the production configuration
echo ""
read -p "Deploy now? (Y/n): " DEPLOY_NOW

if [[ ! $DEPLOY_NOW =~ ^[Nn]$ ]]; then
    echo "🚀 Starting deployment..."
    
    # Export environment variables and start services
    export $(cat .env.production | xargs)
    docker-compose up -d
    
    echo ""
    echo "🎉 Deployment completed!"
    echo ""
    echo "📋 Access Information:"
    echo "  🌐 API Documentation: http://$SERVER_IP:3000/api/docs"
    echo "  🔍 Health Check: http://$SERVER_IP:3000/api/health"
    echo "  📊 MinIO Console: http://$SERVER_IP:9001 (minioadmin/minioadmin)"
    echo ""
    echo "💡 Test the deployment:"
    echo "  curl -X GET http://$SERVER_IP:3000/api/health"
    echo ""
    echo "🔧 To view logs:"
    echo "  docker-compose logs -f"
    echo ""
    echo "⚠️  Note: Make sure ports 3000, 9000, and 9001 are open in your firewall!"
else
    echo "📝 Configuration saved to .env.production"
    echo "   To deploy later, run: docker-compose --env-file .env.production up -d"
fi
