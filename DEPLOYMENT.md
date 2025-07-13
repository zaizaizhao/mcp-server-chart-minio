# 部署指南 - MCP Server Chart MinIO

## 问题修复说明

### 原问题
代码中硬编码了 `localhost`，导致 Docker 部署后在其他机器上访问时出现问题：
- Swagger 文档中的服务器地址无法正确调用 API（会访问 localhost 而不是实际服务器 IP）
- 控制台日志显示的访问地址不正确

### 修复内容

1. **主应用配置** (`src/main.ts`)：
   - 添加 `HOST` 环境变量支持，默认 `0.0.0.0` 允许外部访问
   - 添加 `PUBLIC_API_URL` 环境变量用于 Swagger 文档和日志显示
   - **重要修复**：Swagger 配置动态添加服务器选项
     - 如果设置了 `PUBLIC_API_URL`，优先使用公网地址
     - 始终保留 localhost 作为备选项
     - 移除了无效的 `0.0.0.0` 地址

2. **环境变量配置** (`.env.example`)：
   - 添加 `HOST` 和 `PUBLIC_API_URL` 配置
   - 提供部署时的配置示例

3. **Docker Compose** (`docker-compose.yml`)：
   - 添加 `HOST` 和 `PUBLIC_API_URL` 环境变量

### 解决的关键问题

**Swagger API 调用问题**：现在当您：
1. 通过 IP 访问 Swagger 文档时（如 `http://192.168.1.100:3000/api/docs`）
2. 在 Swagger 界面中调用 API 时，会使用正确的服务器地址
3. 不再出现调用 localhost 导致的连接失败问题

## 部署方式

### 1. 本地开发
```bash
cp .env.example .env
npm run start:dev
```

### 2. Docker Compose（本地）
```bash
docker-compose up -d
```
访问：http://localhost:3000/api/docs

### 3. Docker Compose（服务器部署）

在服务器上部署时，修改 `docker-compose.yml` 中的 `PUBLIC_API_URL`：

```yaml
environment:
  - PUBLIC_API_URL=http://your-server-ip:3000  # 替换为实际服务器IP
```

或者使用环境变量覆盖：
```bash
PUBLIC_API_URL=http://192.168.1.100:3000 docker-compose up -d
```

### 4. 生产环境部署

1. **复制并配置环境变量**：
```bash
cp .env.example .env
```

2. **编辑 `.env` 文件**：
```bash
HOST=0.0.0.0
PORT=3000
PUBLIC_API_URL=https://api.yourdomain.com  # 生产域名
NODE_ENV=production
```

3. **使用环境文件启动**：
```bash
docker-compose --env-file .env up -d
```

## 访问地址

部署完成后，您可以通过以下地址访问：

- **API 文档**: `{PUBLIC_API_URL}/api/docs`
- **API JSON**: `{PUBLIC_API_URL}/api/docs-json`
- **健康检查**: `{PUBLIC_API_URL}/api/health`

## 网络访问配置

### 防火墙设置
确保以下端口在防火墙中开放：
- `3000`: 应用端口
- `9000`: MinIO API 端口
- `9001`: MinIO Console 端口

### 域名配置（可选）
如果使用域名访问，请设置：
1. DNS 记录指向服务器 IP
2. 反向代理（如 Nginx）配置
3. SSL 证书（生产环境推荐）

## 验证部署

1. **健康检查**：
```bash
curl http://your-server-ip:3000/api/health
```

2. **访问 API 文档**：
浏览器打开 `http://your-server-ip:3000/api/docs`

3. **测试 API 调用**：
在 Swagger 文档中测试各个 API 端点
