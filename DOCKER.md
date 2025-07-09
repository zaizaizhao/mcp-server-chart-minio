# Docker 使用指南

## 🐳 Docker 支持

本项目提供了完整的Docker支持，包括生产环境部署。

### 📋 文件说明

- `Dockerfile` - 生产环境多阶段构建
- `docker-compose.yml` - 完整的生产环境编排
- `docker-compose.minio.yml` - 仅MinIO服务
- `.dockerignore` - Docker构建忽略文件

### 🚀 快速启动

#### 1. 生产环境（推荐）
```bash
# 启动完整服务（MinIO + 应用）
npm run docker:up

# 或者使用原生Docker Compose
docker-compose up -d
```

#### 2. 仅启动MinIO
```bash
# 如果你想本地开发，只需要MinIO服务
npm run docker:up:minio

# 或者使用原生Docker Compose
docker-compose -f docker-compose.minio.yml up -d
```

### 🛠️ 开发流程

#### 本地开发 + Docker MinIO
```bash
# 1. 启动MinIO服务
npm run docker:up:minio

# 2. 安装依赖
npm install

# 3. 启动本地开发服务器
npm run start:dev
```

#### 生产环境部署
```bash
# 1. 启动完整服务
npm run docker:up

# 2. 查看日志
npm run docker:logs
```

### 🔧 常用命令

#### 构建镜像
```bash
# 构建生产镜像
npm run docker:build
```

#### 服务管理
```bash
# 启动服务
npm run docker:up          # 生产环境
npm run docker:up:minio    # 仅MinIO

# 停止服务
npm run docker:down        # 生产环境
npm run docker:down:minio  # 仅MinIO
```

#### 日志查看
```bash
# 查看所有服务日志
npm run docker:logs

# 查看应用日志
npm run docker:logs:app

# 查看MinIO日志
npm run docker:logs:minio
```

### 🌐 访问地址

启动成功后，可以访问以下地址：

- **应用API**: http://localhost:3000
- **API文档**: http://localhost:3000/api/docs
- **MinIO控制台**: http://localhost:9001 (用户名: minioadmin, 密码: minioadmin)
- **MinIO API**: http://localhost:9000

### 🔍 健康检查

所有服务都配置了健康检查：

```bash
# 检查应用健康状态
curl http://localhost:3000/api/health

# 检查MinIO健康状态
curl http://localhost:9000/minio/health/live

# 运行完整健康检查
./health-check.sh
```

### 📊 环境变量

Docker环境中的主要环境变量：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `NODE_ENV` | production | 运行环境 |
| `PORT` | 3000 | 应用端口 |
| `MINIO_ENDPOINT` | minio | MinIO服务地址 |
| `MINIO_PORT` | 9000 | MinIO端口 |
| `MINIO_ACCESS_KEY` | minioadmin | MinIO访问密钥 |
| `MINIO_SECRET_KEY` | minioadmin | MinIO密钥 |
| `MINIO_BUCKET_NAME` | charts | 存储桶名称 |

### 🛡️ 安全考虑

1. **生产环境建议**：
   - 修改默认的MinIO访问凭证
   - 使用环境变量文件管理敏感信息
   - 启用SSL/TLS加密

2. **网络安全**：
   - 所有服务运行在独立的Docker网络中
   - 只暴露必要的端口

3. **容器安全**：
   - 使用非root用户运行应用
   - 最小化镜像层数
   - 定期更新基础镜像

### 🐛 故障排除

#### 常见问题

1. **端口冲突**
   ```bash
   # 检查端口占用
   lsof -i :3000
   lsof -i :9000
   lsof -i :9001
   ```

2. **权限问题**
   ```bash
   # 确保Docker有足够权限
   sudo usermod -aG docker $USER
   ```

3. **构建失败**
   ```bash
   # 清理Docker缓存
   docker system prune -a
   
   # 重新构建
   docker-compose build --no-cache
   ```

4. **MinIO连接失败**
   ```bash
   # 检查MinIO服务状态
   docker-compose ps
   
   # 查看MinIO日志
   docker-compose logs minio
   ```

### 🔄 更新和维护

```bash
# 更新镜像
docker-compose pull

# 重启服务
docker-compose restart

# 查看资源使用情况
docker stats

# 清理未使用的资源
docker system prune
```

### 📝 自定义配置

如需自定义配置，可以：

1. 修改`docker-compose.yml`中的环境变量
2. 创建自定义的`.env`文件
3. 修改Dockerfile以添加额外的依赖或配置
