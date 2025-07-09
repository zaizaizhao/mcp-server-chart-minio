#!/bin/bash

# MCP Server Chart MinIO 健康检查脚本

set -e

# 定义颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# 检查服务是否可访问
check_service() {
    local service_name=$1
    local url=$2
    local timeout=${3:-10}
    
    print_info "检查 $service_name ($url)..."
    
    if curl -s --max-time $timeout "$url" > /dev/null; then
        print_success "$service_name 运行正常"
        return 0
    else
        print_error "$service_name 无法访问"
        return 1
    fi
}

# 检查应用健康状态
check_app_health() {
    print_info "检查应用健康状态..."
    
    response=$(curl -s --max-time 10 "http://localhost:3000/api/health" 2>/dev/null || echo "")
    
    if [ -n "$response" ]; then
        print_success "应用健康检查通过"
        echo "响应: $response"
        return 0
    else
        print_error "应用健康检查失败"
        return 1
    fi
}

# 检查MinIO API
check_minio_api() {
    print_info "检查MinIO API..."
    
    response=$(curl -s --max-time 10 "http://localhost:9000/minio/health/live" 2>/dev/null || echo "")
    
    if [ -n "$response" ]; then
        print_success "MinIO API 运行正常"
        return 0
    else
        print_error "MinIO API 无法访问"
        return 1
    fi
}

# 检查Docker容器状态
check_docker_containers() {
    print_info "检查Docker容器状态..."
    
    # 检查容器
    if docker ps --format "table {{.Names}}\t{{.Status}}" | grep -q "mcp-chart"; then
        print_success "找到运行中的容器:"
        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep "mcp-chart"
    else
        print_warning "未找到运行中的MCP容器"
    fi
    
    echo
}

# 测试API端点
test_api_endpoints() {
    print_info "测试API端点..."
    
    # 测试健康检查端点
    if check_service "健康检查" "http://localhost:3000/api/health"; then
        echo
    fi
    
    # 测试图表类型端点
    if check_service "图表类型" "http://localhost:3000/api/chart/types"; then
        echo
    fi
    
    # 测试MinIO存储桶端点
    if check_service "MinIO存储桶" "http://localhost:3000/api/minio/buckets"; then
        echo
    fi
}

# 测试图表生成
test_chart_generation() {
    print_info "测试图表生成..."
    
    test_data='{
        "type": "line",
        "data": [
            {"time": "2020", "value": 100},
            {"time": "2021", "value": 120},
            {"time": "2022", "value": 140}
        ],
        "title": "健康检查测试图表"
    }'
    
    response=$(curl -s --max-time 30 \
        -X POST \
        -H "Content-Type: application/json" \
        -d "$test_data" \
        "http://localhost:3000/api/chart/render" 2>/dev/null || echo "")
    
    if [ -n "$response" ] && echo "$response" | grep -q "url"; then
        print_success "图表生成测试通过"
        echo "响应: $response"
        return 0
    else
        print_error "图表生成测试失败"
        if [ -n "$response" ]; then
            echo "错误响应: $response"
        fi
        return 1
    fi
}

# 显示系统资源使用情况
show_resource_usage() {
    print_info "Docker资源使用情况:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" | head -10
    echo
}

# 主函数
main() {
    echo "======================================"
    echo "MCP Server Chart MinIO 健康检查"
    echo "======================================"
    echo
    
    # 检查Docker容器
    check_docker_containers
    
    # 检查服务可访问性
    check_app_health
    echo
    
    check_minio_api
    echo
    
    # 测试API端点
    test_api_endpoints
    
    # 测试图表生成（可选）
    if [ "$1" == "--full" ] || [ "$1" == "-f" ]; then
        print_info "执行完整测试..."
        test_chart_generation
        echo
    fi
    
    # 显示资源使用情况
    if [ "$1" == "--stats" ] || [ "$1" == "-s" ]; then
        show_resource_usage
    fi
    
    echo "======================================"
    print_success "健康检查完成"
    echo "======================================"
    
    echo
    print_info "使用说明:"
    echo "  $0          # 基本健康检查"
    echo "  $0 --full   # 完整测试（包括图表生成）"
    echo "  $0 --stats  # 显示资源使用情况"
    echo
    print_info "如果发现问题，请检查："
    echo "  • Docker容器是否正在运行: docker ps"
    echo "  • 查看容器日志: docker logs [容器名]"
    echo "  • 检查端口是否被占用: lsof -i :3000 -i :9000 -i :9001"
}

# 运行主函数
main "$@"
