# 📊 MCP Server Chart MinIO

基于 NestJS 的图表生成服务，集成 MinIO 对象存储，支持 22+ 种图表类型的服务器端渲染。

## ✨ 主要特性

- 🎨 **22+ 图表类型**：线图、柱图、饼图、雷达图、桑基图等
- 🚀 **服务器端渲染**：基于 @antv/gpt-vis-ssr 的高性能图表生成
- ☁️ **云存储集成**：MinIO 对象存储，自动生成访问URL
- 🔧 **RESTful API**：完整的 OpenAPI 文档
- 🐳 **Docker 部署**：一键启动完整服务

## 📈 支持的图表类型

**基础图表**：line（折线图）、area（面积图）、column（柱状图）、bar（条形图）、pie（饼图）、scatter（散点图）

**高级图表**：histogram（直方图）、boxplot（箱线图）、radar（雷达图）、funnel（漏斗图）、treemap（树状图）、sankey（桑基图）、word-cloud（词云图）、dual-axes（双轴图）、liquid（水波图）、violin（小提琴图）、venn（韦恩图）

**关系图表**：mind-map（思维导图）、organization-chart（组织架构图）、flow-diagram（流程图）、fishbone-diagram（鱼骨图）、network-graph（网络图）

## 🛠️ 系统要求

- Node.js (v18+)
- npm 或 yarn
- Docker (推荐)

## 🚀 快速开始

### 方式一：Docker Compose 部署（推荐）

**适用于：生产环境、虚拟机部署、一键启动**

#### 🏠 本地部署
1. 克隆项目：
```bash
git clone <repository-url>
cd mcp-server-chart-minio
```

2. 一键启动所有服务：
```bash
docker-compose up -d
```

3. 访问服务：
   - 📊 **API 服务**: http://localhost:3000
   - 📖 **API 文档**: http://localhost:3000/api/docs  
   - 💾 **MinIO 控制台**: http://localhost:9001 (minioadmin/minioadmin)

#### 🌐 生产环境/虚拟机部署

**重要配置参数说明：**

1. **修改外部访问地址**（必须）：
   
   编辑 `docker-compose.yml` 文件，将以下参数改为您的服务器 IP：
   ```yaml
   environment:
     - PUBLIC_API_URL=http://YOUR_SERVER_IP:3000
     - MINIO_EXTERNAL_ENDPOINT=YOUR_SERVER_IP
   ```

2. **安全配置**（推荐）：
   
   修改默认密码：
   ```yaml
   minio:
     environment:
       MINIO_ROOT_USER: your_admin_user      # 修改管理员用户名
       MINIO_ROOT_PASSWORD: your_secure_pwd  # 修改管理员密码（8位以上）
   
   app:
     environment:
       - MINIO_ACCESS_KEY=your_admin_user    # 与上面保持一致
       - MINIO_SECRET_KEY=your_secure_pwd    # 与上面保持一致
   ```

3. **端口配置**（可选）：
   
   如需修改端口：
   ```yaml
   services:
     minio:
       ports:
         - "9000:9000"  # MinIO API 端口
         - "9001:9001"  # MinIO 控制台端口
     app:
       ports:
         - "3000:3000"  # 应用端口
   ```

4. **数据持久化**：
   
   默认使用 Docker 卷存储，如需指定路径：
   ```yaml
   volumes:
     - /your/data/path:/data  # 替换为实际路径
   ```

#### 快速部署脚本

**Linux/macOS：**
```bash
# 自动配置生产环境
export SERVER_IP=192.168.1.100  # 替换为您的服务器IP
sed -i "s/localhost/$SERVER_IP/g" docker-compose.yml
docker-compose up -d
```

**Windows PowerShell：**
```powershell
# 自动配置生产环境
$SERVER_IP = "192.168.1.100"  # 替换为您的服务器IP
(Get-Content docker-compose.yml) -replace 'localhost', $SERVER_IP | Set-Content docker-compose.yml
docker-compose up -d
```

### 方式二：NPM 开发环境

**适用于：本地开发、调试、代码修改**

1. 克隆项目：
```bash
git clone <repository-url>
cd mcp-server-chart-minio
```

2. 安装系统依赖（Canvas 图像渲染所需）：
```bash
# macOS
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman

# Ubuntu/Debian
sudo apt-get install pkg-config libcairo2-dev libpango1.0-dev libpng-dev libjpeg-dev libgif-dev librsvg2-dev libpixman-1-dev
```

3. 启动 MinIO 存储服务：
```bash
npm run docker:up:minio
```

4. 安装项目依赖：
```bash
npm install
```

5. 启动开发服务器：
```bash
npm run start:dev
```
## 📊 API 使用示例

### 生成折线图
```bash
curl -X POST http://localhost:3000/api/chart-generators/line \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      {"time": "一月", "value": 100},
      {"time": "二月", "value": 120},
      {"time": "三月", "value": 140}
    ],
    "title": "销售趋势图"
  }'
```

### 生成饼图
```bash
curl -X POST http://localhost:3000/api/chart-generators/pie \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      {"category": "产品A", "value": 30},
      {"category": "产品B", "value": 25},
      {"category": "产品C", "value": 45}
    ],
    "title": "市场份额"
  }'
```

## 🔧 环境配置

### Docker Compose 参数详解

#### 核心服务配置
| 参数 | 默认值 | 说明 | 修改建议 |
|------|--------|------|----------|
| `PUBLIC_API_URL` | `http://localhost:3000` | API 服务外部访问地址 | 生产环境改为实际 IP |
| `MINIO_EXTERNAL_ENDPOINT` | `localhost` | MinIO 外部访问地址 | 生产环境改为实际 IP |
| `MINIO_EXTERNAL_PORT` | `9000` | MinIO 外部访问端口 | 通常保持默认 |

#### MinIO 存储配置
| 参数 | 默认值 | 说明 | 修改建议 |
|------|--------|------|----------|
| `MINIO_ROOT_USER` | `minioadmin` | MinIO 管理员用户名 | 生产环境必须修改 |
| `MINIO_ROOT_PASSWORD` | `minioadmin` | MinIO 管理员密码 | 生产环境必须修改（8位以上）|
| `MINIO_BUCKET_NAME` | `charts` | 默认存储桶名称 | 可根据需要修改 |

#### 应用服务配置
| 参数 | 默认值 | 说明 | 修改建议 |
|------|--------|------|----------|
| `NODE_ENV` | `production` | 运行环境 | 保持默认 |
| `PORT` | `3000` | 应用端口 | 可根据需要修改 |
| `HOST` | `0.0.0.0` | 监听地址 | 保持默认 |

### 生产环境部署检查清单

#### ✅ 必须修改的配置
- [ ] 修改 `PUBLIC_API_URL` 为服务器实际 IP
- [ ] 修改 `MINIO_EXTERNAL_ENDPOINT` 为服务器实际 IP  
- [ ] 修改 `MINIO_ROOT_USER` 和 `MINIO_ROOT_PASSWORD`
- [ ] 更新应用中的 `MINIO_ACCESS_KEY` 和 `MINIO_SECRET_KEY`

#### 🔒 安全配置建议
- [ ] 使用强密码（至少8位，包含字母数字特殊字符）
- [ ] 配置防火墙，只开放必要端口（3000, 9000, 9001）
- [ ] 启用 HTTPS（生产环境推荐）
- [ ] 定期备份 MinIO 数据

#### 🌐 网络配置检查
- [ ] 确保服务器端口 3000、9000、9001 已开放
- [ ] 验证外部网络可以访问这些端口
- [ ] 检查防火墙和安全组设置

### 配置示例

#### 开发环境配置
```yaml
# 适用于本地开发，使用默认配置
environment:
  - PUBLIC_API_URL=http://localhost:3000
  - MINIO_EXTERNAL_ENDPOINT=localhost
  - MINIO_ROOT_USER=minioadmin
  - MINIO_ROOT_PASSWORD=minioadmin
```

#### 生产环境配置
```yaml
# 适用于生产部署，服务器 IP: 192.168.1.100
environment:
  - PUBLIC_API_URL=http://192.168.1.100:3000
  - MINIO_EXTERNAL_ENDPOINT=192.168.1.100
  - MINIO_ROOT_USER=chart_admin
  - MINIO_ROOT_PASSWORD=SecurePass2024!
```

### NPM 开发配置
创建 `.env` 文件：
```env
# 基础配置
NODE_ENV=development
PORT=3000
HOST=localhost

# MinIO 连接配置
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=charts

# 外部访问配置（开发环境可选）
MINIO_EXTERNAL_ENDPOINT=localhost
MINIO_EXTERNAL_PORT=9000
```

## 🚨 常见问题

### Docker Compose 部署问题

#### 外部访问问题
**问题**：在虚拟机或服务器上部署后，外部无法访问服务

**解决方案**：
1. **检查配置**：
   ```bash
   # 查看当前配置
   grep -E "(PUBLIC_API_URL|MINIO_EXTERNAL)" docker-compose.yml
   ```

2. **修改配置**：
   ```bash
   # 方法1：手动编辑 docker-compose.yml
   nano docker-compose.yml
   
   # 方法2：使用脚本批量替换
   sed -i 's/localhost/你的服务器IP/g' docker-compose.yml
   ```

3. **重启服务**：
   ```bash
   docker-compose down
   docker-compose up -d
   ```

#### 端口冲突问题
**问题**：启动时提示端口被占用

**解决方案**：
```bash
# 检查端口占用
netstat -tulpn | grep -E "(3000|9000|9001)"

# 修改端口映射（在 docker-compose.yml 中）
ports:
  - "3001:3000"  # 改为 3001
  - "9002:9000"  # 改为 9002
  - "9003:9001"  # 改为 9003
```

#### 权限问题
**问题**：MinIO 数据目录权限不足

**解决方案**：
```bash
# 创建数据目录并设置权限
sudo mkdir -p /docker/minio-data
sudo chown -R 1000:1000 /docker/minio-data

# 在 docker-compose.yml 中指定路径
volumes:
  - /docker/minio-data:/data
```

#### 网络连接问题
**问题**：容器间无法通信

**解决方案**：
```bash
# 检查网络状态
docker network ls
docker network inspect mcp-server-chart-minio_mcp-network

# 重新创建网络
docker-compose down
docker system prune -f
docker-compose up -d
```

### Canvas 依赖问题
如果安装依赖时遇到 Canvas 编译错误：
```bash
# 清除缓存重新安装
npm cache clean --force
rm -rf node_modules
npm install

# Apple Silicon Mac
arch -x86_64 npm install canvas

# Ubuntu/Debian 安装系统依赖
sudo apt-get update
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
```

### MinIO 连接问题
1. **服务状态检查**：
   ```bash
   # 检查容器状态
   docker-compose ps
   
   # 查看 MinIO 日志
   docker-compose logs minio
   
   # 检查健康状态
   docker-compose exec minio curl -f http://localhost:9000/minio/health/live
   ```

2. **访问权限检查**：
   ```bash
   # 测试 MinIO API 连接
   curl -I http://你的服务器IP:9000
   
   # 检查防火墙状态（Ubuntu）
   sudo ufw status
   sudo ufw allow 9000
   sudo ufw allow 9001
   ```

### 容器启动问题

#### 内存不足
```bash
# 检查系统资源
docker system df
free -h

# 清理无用容器和镜像
docker system prune -a
```

#### 镜像构建失败
```bash
# 重新构建镜像
docker-compose build --no-cache app

# 查看构建日志
docker-compose build app --progress=plain
```

### 数据持久化问题

#### 数据丢失
**预防措施**：
```bash
# 备份 MinIO 数据
docker run --rm -v mcp-server-chart-minio_minio_data:/source -v $(pwd):/backup busybox tar czf /backup/minio-backup.tar.gz -C /source .

# 恢复数据
docker run --rm -v mcp-server-chart-minio_minio_data:/target -v $(pwd):/backup busybox tar xzf /backup/minio-backup.tar.gz -C /target
```

## 📖 API 文档

启动服务后访问：http://localhost:3000/api/docs

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

**🌟 如果这个项目对你有帮助，请给个 Star 支持一下！**
