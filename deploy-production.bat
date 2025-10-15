@echo off
setlocal enabledelayedexpansion

echo 🚀 MCP Server Chart MinIO - Production Deployment Setup
echo =======================================================

REM Check if docker-compose is available
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ docker-compose is not installed. Please install it first.
    pause
    exit /b 1
)

REM Get server IP address
set /p SERVER_IP="Enter your server's IP address (e.g., 192.168.1.100): "

if "%SERVER_IP%"=="" (
    echo ❌ Server IP is required. Exiting.
    pause
    exit /b 1
)

echo.
echo 📝 Configuration Summary:
echo   Server IP: %SERVER_IP%
echo   API URL: http://%SERVER_IP%:3000
echo   MinIO Console: http://%SERVER_IP%:9001
echo.

REM Create production environment file
(
echo # Production Docker Deployment Configuration
echo PORT=3000
echo HOST=0.0.0.0
echo NODE_ENV=production
echo PUBLIC_API_URL=http://%SERVER_IP%:3000
echo.
echo # MinIO Connection for the app
echo MINIO_ENDPOINT=minio
echo MINIO_PORT=9000
echo MINIO_USE_SSL=false
echo MINIO_ACCESS_KEY=minioadmin
echo MINIO_SECRET_KEY=minioadmin
echo.
echo # Bucket settings
echo MINIO_BUCKET_NAME=charts
echo MINIO_AUTO_CREATE_BUCKET=false
echo.
echo # MinIO External Access Configuration
echo MINIO_EXTERNAL_ENDPOINT=%SERVER_IP%
echo MINIO_EXTERNAL_PORT=9000
echo.
echo # MinIO server admin ^(used by Docker minio service^)
echo MINIO_ROOT_USER=minioadmin
echo MINIO_ROOT_PASSWORD=minioadmin
) > .env.production

echo ✅ Created .env.production file

REM Deploy with the production configuration
echo.
set /p DEPLOY_NOW="Deploy now? (Y/n): "

if /i not "%DEPLOY_NOW%"=="n" (
    echo 🚀 Starting deployment...
    
    REM Start services with production environment
    docker-compose --env-file .env.production up -d
    
    echo.
    echo 🎉 Deployment completed!
    echo.
    echo 📋 Access Information:
    echo   🌐 API Documentation: http://%SERVER_IP%:3000/api/docs
    echo   🔍 Health Check: http://%SERVER_IP%:3000/api/health
    echo   📊 MinIO Console: http://%SERVER_IP%:9001 ^(minioadmin/minioadmin^)
    echo.
    echo 💡 Test the deployment:
    echo   curl -X GET http://%SERVER_IP%:3000/api/health
    echo.
    echo 🔧 To view logs:
    echo   docker-compose logs -f
    echo.
    echo ⚠️  Note: Make sure ports 3000, 9000, and 9001 are open in your firewall!
) else (
    echo 📝 Configuration saved to .env.production
    echo    To deploy later, run: docker-compose --env-file .env.production up -d
)

echo.
pause
