#!/bin/bash

# MCP Server Chart MinIO 启动脚本
# 用于快速启动不同环境的服务

set -e

# 定义颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印彩色消息
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 检查Docker是否安装
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker 未安装，请先安装 Docker"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose 未安装，请先安装 Docker Compose"
        exit 1
    fi
}

# 检查环境文件
check_env_file() {
    if [ ! -f .env ]; then
        print_warning ".env 文件不存在，正在从 .env.example 复制..."
        if [ -f .env.example ]; then
            cp .env.example .env
            print_success "已创建 .env 文件"
        else
            print_error ".env.example 文件不存在"
            exit 1
        fi
    fi
}

# 显示帮助信息
show_help() {
    echo "MCP Server Chart MinIO 启动脚本"
    echo
    echo "用法: $0 [命令]"
    echo
    echo "命令:"
    echo "  prod        启动生产环境 (默认)"
    echo "  minio       仅启动MinIO服务"
    echo "  stop        停止所有服务"
    echo "  logs        查看日志"
    echo "  status      查看服务状态"
    echo "  restart     重启服务"
    echo "  clean       清理Docker资源"
    echo "  help        显示此帮助信息"
    echo
    echo "示例:"
    echo "  $0 prod     # 启动生产环境"
    echo "  $0 minio    # 仅启动MinIO"
    echo "  $0 logs     # 查看日志"
    echo "  $0 stop     # 停止服务"
}

# 启动生产环境
start_production() {
    print_info "启动生产环境..."
    docker-compose up -d --build
    print_success "生产环境已启动"
    show_access_info
}

# 启动MinIO服务
start_minio() {
    print_info "启动MinIO服务..."
    docker-compose -f docker-compose.minio.yml up -d
    print_success "MinIO服务已启动"
    print_info "MinIO控制台: http://localhost:9001"
    print_info "用户名: minioadmin"
    print_info "密码: minioadmin"
    echo
    print_info "现在可以运行 'npm run start:dev' 启动本地开发服务器"
}

# 停止服务
stop_services() {
    print_info "正在停止所有服务..."
    docker-compose down
    docker-compose -f docker-compose.minio.yml down
    print_success "所有服务已停止"
}

# 查看日志
show_logs() {
    print_info "显示服务日志..."
    docker-compose logs -f
}

# 查看服务状态
show_status() {
    print_info "生产环境状态:"
    docker-compose ps
    echo
    print_info "MinIO服务状态:"
    docker-compose -f docker-compose.minio.yml ps
}

# 重启服务
restart_services() {
    print_info "重启服务..."
    docker-compose restart
    print_success "服务已重启"
}

# 清理Docker资源
clean_docker() {
    print_warning "这将删除所有未使用的Docker资源"
    read -p "确定要继续吗？(y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "清理Docker资源..."
        docker system prune -f
        print_success "Docker资源已清理"
    else
        print_info "取消清理"
    fi
}

# 显示访问信息
show_access_info() {
    echo
    print_success "服务已成功启动！"
    echo
    print_info "访问地址:"
    echo "  🌐 API服务: http://localhost:3000"
    echo "  📚 API文档: http://localhost:3000/api/docs"
    echo "  🗂️  MinIO控制台: http://localhost:9001"
    echo "  👤 MinIO用户名: minioadmin"
    echo "  🔑 MinIO密码: minioadmin"
    echo
    print_info "健康检查:"
    echo "  curl http://localhost:3000/api/health"
    echo
    print_info "停止服务:"
    echo "  $0 stop"
}

# 主函数
main() {
    check_docker
    check_env_file
    
    case "${1:-prod}" in
        "prod"|"production")
            start_production
            ;;
        "minio")
            start_minio
            ;;
        "stop")
            stop_services
            ;;
        "logs")
            show_logs
            ;;
        "status")
            show_status
            ;;
        "restart")
            restart_services
            ;;
        "clean")
            clean_docker
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            print_error "未知命令: $1"
            echo
            show_help
            exit 1
            ;;
    esac
}

# 运行主函数
main "$@"
