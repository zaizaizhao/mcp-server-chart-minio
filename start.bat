@echo off
setlocal enabledelayedexpansion

REM MCP Server Chart MinIO 启动脚本 (Windows版本)
REM 用于快速启动不同环境的服务

title MCP Server Chart MinIO

REM 检查Docker是否安装
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker 未安装，请先安装 Docker Desktop
    pause
    exit /b 1
)

where docker-compose >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker Compose 未安装，请先安装 Docker Compose
    pause
    exit /b 1
)

REM 检查环境文件
if not exist .env (
    echo [WARNING] .env 文件不存在，正在从 .env.example 复制...
    if exist .env.example (
        copy .env.example .env >nul
        echo [SUCCESS] 已创建 .env 文件
    ) else (
        echo [ERROR] .env.example 文件不存在
        pause
        exit /b 1
    )
)

REM 显示帮助信息
if "%1"=="help" goto :show_help
if "%1"=="-h" goto :show_help
if "%1"=="--help" goto :show_help

REM 根据参数执行不同操作
if "%1"=="prod" goto :start_production
if "%1"=="production" goto :start_production
if "%1"=="minio" goto :start_minio
if "%1"=="stop" goto :stop_services
if "%1"=="logs" goto :show_logs
if "%1"=="status" goto :show_status
if "%1"=="restart" goto :restart_services
if "%1"=="clean" goto :clean_docker
if "%1"=="" goto :start_production

echo [ERROR] 未知命令: %1
echo.
goto :show_help

:show_help
echo MCP Server Chart MinIO 启动脚本 (Windows版本)
echo.
echo 用法: %0 [命令]
echo.
echo 命令:
echo   prod        启动生产环境 (默认)
echo   minio       仅启动MinIO服务
echo   stop        停止所有服务
echo   logs        查看日志
echo   status      查看服务状态
echo   restart     重启服务
echo   clean       清理Docker资源
echo   help        显示此帮助信息
echo.
echo 示例:
echo   %0 prod     # 启动生产环境
echo   %0 minio    # 仅启动MinIO
echo   %0 logs     # 查看日志
echo   %0 stop     # 停止服务
pause
exit /b 0

:start_production
echo [INFO] 启动生产环境...
docker-compose up -d --build
if %errorlevel% equ 0 (
    echo [SUCCESS] 生产环境已启动
    call :show_access_info
) else (
    echo [ERROR] 启动生产环境失败
    pause
    exit /b 1
)
goto :end

:start_minio
echo [INFO] 启动MinIO服务...
docker-compose -f docker-compose.minio.yml up -d
if %errorlevel% equ 0 (
    echo [SUCCESS] MinIO服务已启动
    echo [INFO] MinIO控制台: http://localhost:9001
    echo [INFO] 用户名: minioadmin
    echo [INFO] 密码: minioadmin
    echo.
    echo [INFO] 现在可以运行 'npm run start:dev' 启动本地开发服务器
) else (
    echo [ERROR] 启动MinIO服务失败
    pause
    exit /b 1
)
goto :end

:stop_services
echo [INFO] 正在停止所有服务...
docker-compose down
docker-compose -f docker-compose.minio.yml down
echo [SUCCESS] 所有服务已停止
goto :end

:show_logs
echo [INFO] 显示服务日志...
docker-compose logs -f
goto :end

:show_status
echo [INFO] 生产环境状态:
docker-compose ps
echo.
echo [INFO] MinIO服务状态:
docker-compose -f docker-compose.minio.yml ps
goto :end

:restart_services
echo [INFO] 重启服务...
docker-compose restart
echo [SUCCESS] 服务已重启
goto :end

:clean_docker
echo [WARNING] 这将删除所有未使用的Docker资源
set /p confirm=确定要继续吗？(y/N): 
if /i "!confirm!"=="y" (
    echo [INFO] 清理Docker资源...
    docker system prune -f
    echo [SUCCESS] Docker资源已清理
) else (
    echo [INFO] 取消清理
)
goto :end

:show_access_info
echo.
echo [SUCCESS] 服务已成功启动！
echo.
echo [INFO] 访问地址:
echo   🌐 API服务: http://localhost:3000
echo   📚 API文档: http://localhost:3000/api/docs
echo   🗂️  MinIO控制台: http://localhost:9001
echo   👤 MinIO用户名: minioadmin
echo   🔑 MinIO密码: minioadmin
echo.
echo [INFO] 健康检查:
echo   curl http://localhost:3000/api/health
echo.
echo [INFO] 停止服务:
echo   %0 stop
exit /b 0

:end
pause
exit /b 0
