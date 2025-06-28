# 📊 MCP Server Chart MinIO

[中文](#中文) | [English](#english)

## 中文

### 🎯 项目动机

随着数据可视化在现代应用中变得越来越重要，开发者经常面临以下挑战：

- **复杂的图表集成**：设置具有服务器端渲染功能的图表库
- **存储管理**：处理图表图像存储和URL生成  
- **类型安全**：确保不同图表类型的数据验证
- **API一致性**：为多种图表类型提供统一接口

本项目提供了一个全面的**基于NestJS的图表生成服务**，结合了`@antv/gpt-vis-ssr`的图表渲染能力和**MinIO**的可靠云存储，为开发者提供了生产就绪的图表生成API解决方案。

### ✨ 特性

- 🎨 **22+图表类型**：支持所有主要图表类型，包括基础图表、高级可视化和关系图表
- 🚀 **高性能**：优化的图像生成和服务器端渲染
- ☁️ **云存储**：与MinIO无缝集成，提供可扩展的文件存储
- 🛡️ **类型安全**：完整的TypeScript支持和综合数据验证
- 🔧 **易于集成**：具有OpenAPI文档的RESTful API
- 🧪 **全面测试**：自动化测试套件和可视化仪表板
- 📊 **生产就绪**：使用NestJS构建的企业级应用

### 📈 支持的图表类型

#### 基础图表 (6种)
- `line` - 折线图
- `area` - 面积图  
- `column` - 柱状图
- `bar` - 条形图
- `pie` - 饼图
- `scatter` - 散点图

#### 高级图表 (11种)
- `histogram` - 直方图
- `boxplot` - 箱线图
- `radar` - 雷达图
- `funnel` - 漏斗图
- `treemap` - 树状图
- `sankey` - 桑基图
- `word-cloud` - 词云图
- `dual-axes` - 双轴图
- `liquid` - 水波图
- `violin` - 小提琴图
- `venn` - 韦恩图

#### 关系图表 (5种)
- `mind-map` - 思维导图
- `organization-chart` - 组织架构图
- `flow-diagram` - 流程图
- `fishbone-diagram` - 鱼骨图
- `network-graph` - 网络图

### 🛠️ 系统要求

- Node.js (v16或更高版本)
- npm或yarn
- 运行中的MinIO服务器（本地或远程）
- **@antv/gpt-vis-ssr的系统依赖（Canvas渲染）**：
  - macOS: `brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman`
  - Ubuntu/Debian: `sudo apt-get install pkg-config libcairo2-dev libpango1.0-dev libpng-dev libjpeg-dev libgif-dev librsvg2-dev libpixman-1-dev`
  - CentOS/RHEL: `sudo yum install pkgconfig cairo-devel pango-devel libpng-devel libjpeg-devel giflib-devel librsvg2-devel pixman-devel`

### 📦 安装

1. 克隆仓库：
```bash
git clone <repository-url>
cd mcp-server-chart-minio
```

2. 启动MinIO服务（使用Docker）：
```bash
docker-compose up -d
```

3. 安装系统依赖（Canvas所需）：
```bash
# macOS
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman

# Ubuntu/Debian
sudo apt-get install pkg-config libcairo2-dev libpango1.0-dev libpng-dev libjpeg-dev libgif-dev librsvg2-dev libpixman-1-dev

# CentOS/RHEL
sudo yum install pkgconfig cairo-devel pango-devel libpng-devel libjpeg-devel giflib-devel librsvg2-devel pixman-devel
```

4. 安装项目依赖：
```bash
npm install
```

5. 配置环境变量：
```bash
cp .env.example .env
```

编辑`.env`文件配置MinIO（如使用Docker Compose，可保持默认值）：
```env
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=charts
PORT=3000
```

### 🚀 运行应用

#### 开发模式
```bash
npm run start:dev
```

#### 生产模式
```bash
npm run build
npm run start:prod
```

应用将在以下地址可用：
- API: `http://localhost:3000`
- API文档: `http://localhost:3000/api/docs`
- MinIO控制台: `http://localhost:9001` (admin/minioadmin)

### ⚡ 快速开始

1. **启动服务：**
```bash
# 启动MinIO
docker-compose up -d

# 启动应用
npm run start:dev
```

2. **测试基础图表：**
```bash
curl -X POST http://localhost:3000/api/chart-generators/line \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      {"time": "一月", "value": 100},
      {"time": "二月", "value": 120},
      {"time": "三月", "value": 140}
    ],
    "title": "快速测试图表"
  }'
```

3. **打开测试仪表板：**
```bash
open test-dashboard.html
```

4. **查看API文档：**
   访问 `http://localhost:3000/api/docs` 进行交互式API测试

### 📊 API端点

#### 健康检查
- `GET /api/health` - 应用健康状态

#### 图表操作
- `POST /api/chart/render` - 渲染图表并上传到MinIO
- `GET /api/chart/types` - 获取支持的图表类型
- `GET /api/chart/sample` - 生成示例图表

#### MinIO操作
- `GET /api/minio/buckets` - 列出所有存储桶
- `POST /api/minio/buckets` - 创建新存储桶
- `DELETE /api/minio/buckets/:bucketName` - 删除存储桶
- `GET /api/minio/buckets/:bucketName/objects` - 列出存储桶中的对象

### 📊 图表渲染示例

#### 基础折线图
```bash
curl -X POST http://localhost:3000/api/chart/render \
  -H "Content-Type: application/json" \
  -d '{
    "type": "line",
    "data": [
      {"time": "2020", "value": 100},
      {"time": "2021", "value": 120},
      {"time": "2022", "value": 140}
    ],
    "title": "销售趋势图"
  }'
```

#### 饼图
```bash
curl -X POST http://localhost:3000/api/chart/render \
  -H "Content-Type: application/json" \
  -d '{
    "type": "pie",
    "data": [
      {"category": "产品A", "value": 30},
      {"category": "产品B", "value": 25},
      {"category": "产品C", "value": 45}
    ],
    "title": "市场份额分析"
  }'
```

#### 生成示例图表
```bash
# 生成示例折线图
curl "http://localhost:3000/api/chart/sample?type=line&theme=default"
```

### 🎨 图表生成器API

项目为每种图表类型提供专用端点，具有优化的数据处理：

#### 基础图表
- `POST /api/chart-generators/line` - 折线图
- `POST /api/chart-generators/area` - 面积图
- `POST /api/chart-generators/column` - 柱状图
- `POST /api/chart-generators/bar` - 条形图
- `POST /api/chart-generators/pie` - 饼图
- `POST /api/chart-generators/scatter` - 散点图

#### 高级图表
- `POST /api/chart-generators/histogram` - 直方图
- `POST /api/chart-generators/boxplot` - 箱线图
- `POST /api/chart-generators/radar` - 雷达图
- `POST /api/chart-generators/funnel` - 漏斗图
- `POST /api/chart-generators/treemap` - 树状图
- `POST /api/chart-generators/sankey` - 桑基图
- `POST /api/chart-generators/word-cloud` - 词云图
- `POST /api/chart-generators/dual-axes` - 双轴图
- `POST /api/chart-generators/liquid` - 水波图
- `POST /api/chart-generators/violin` - 小提琴图
- `POST /api/chart-generators/venn` - 韦恩图

#### 关系图表
- `POST /api/chart-generators/mind-map` - 思维导图
- `POST /api/chart-generators/organization-chart` - 组织架构图
- `POST /api/chart-generators/flow-diagram` - 流程图
- `POST /api/chart-generators/fishbone-diagram` - 鱼骨图
- `POST /api/chart-generators/network-graph` - 网络图

### 🏗️ 复杂图表示例

#### 双轴图
```bash
curl -X POST http://localhost:3000/api/chart-generators/dual-axes \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      {"time": "2020", "value1": 100, "value2": 50},
      {"time": "2021", "value1": 120, "value2": 60},
      {"time": "2022", "value1": 140, "value2": 45}
    ],
    "title": "销售额与利润对比"
  }'
```

#### 流程图
```bash
curl -X POST http://localhost:3000/api/chart-generators/flow-diagram \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "nodes": [
        {"id": "start", "label": "开始"},
        {"id": "process", "label": "处理"},
        {"id": "end", "label": "结束"}
      ],
      "edges": [
        {"source": "start", "target": "process"},
        {"source": "process", "target": "end"}
      ]
    },
    "title": "工作流程图"
  }'
```

#### 桑基图
```bash
curl -X POST http://localhost:3000/api/chart-generators/sankey \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      {"source": "A", "target": "B", "value": 10},
      {"source": "B", "target": "C", "value": 15},
      {"source": "A", "target": "C", "value": 5}
    ],
    "title": "能源流向图"
  }'
```

### 🧪 测试

```bash
# 单元测试
npm run test

# 测试覆盖率
npm run test:cov

# E2E测试
npm run test:e2e
```

### 🔧 开发

```bash
# 格式化代码
npm run format

# 代码检查
npm run lint

# 监视模式
npm run start:dev
```

### 🧪 自动化测试

项目包含完整的测试工具：

```bash
# 运行所有图表测试
node test-all-charts.js

# 运行关键修复测试
node test-critical-fixes.js

# 打开可视化测试仪表板
open test-dashboard.html
```

### 🎨 可视化测试仪表板

项目包含精美的HTML仪表板（`test-dashboard.html`）用于交互式测试：
- 🎨 测试所有22种图表类型并实时预览
- 📊 为每种图表类型生成示例数据
- 🔍 响应检查和错误处理
- 💡 现代响应式UI和深色主题

### 🏗️ 项目结构

```
src/
├── main.ts                           # 应用入口点
├── app.module.ts                     # 根模块
├── app.controller.ts                 # 根控制器
├── app.service.ts                    # 根服务
├── chart/                           # 图表渲染模块
│   ├── chart.module.ts
│   ├── chart.controller.ts
│   └── chart-render.service.ts       # 核心图表渲染逻辑
├── chart-generators/                # 图表API端点
│   ├── chart-generators.controller.ts # 22+图表类型端点
│   ├── chart-generators.module.ts
│   └── dto/
│       └── chart-generators.dto.ts   # 所有图表类型的TypeScript DTO
├── minio/                           # MinIO集成
│   ├── minio.module.ts
│   ├── minio.service.ts
│   └── minio.controller.ts
└── docs/                           # API文档
    └── chart.md
```

### 📚 API文档

本项目提供完整的OpenAPI/Swagger文档，包含：
- 📝 所有22种图表类型的详细参数描述
- 💡 交互式示例和示例数据
- 🔒 带有TypeScript DTO的请求/响应架构
- 🧪 内置API测试界面

访问文档：`http://localhost:3000/api/docs`

### 🌍 环境变量

| 变量 | 描述 | 默认值 |
|----------|-------------|---------|
| `MINIO_ENDPOINT` | MinIO服务器端点 | `localhost` |
| `MINIO_PORT` | MinIO服务器端口 | `9000` |
| `MINIO_USE_SSL` | 使用SSL连接 | `false` |
| `MINIO_ACCESS_KEY` | MinIO访问密钥 | `minioadmin` |
| `MINIO_SECRET_KEY` | MinIO秘密密钥 | `minioadmin` |
| `MINIO_BUCKET_NAME` | 默认存储桶名称 | `charts` |
| `PORT` | 应用端口 | `3000` |

### 🔧 工作原理

1. **图表渲染**：使用`@antv/gpt-vis-ssr`进行服务器端图表渲染
2. **数据处理**：转换输入数据以匹配每种图表类型的要求
3. **图像生成**：使用Canvas将图表转换为PNG缓冲区
4. **云存储**：将图像上传到MinIO对象存储，支持自动存储桶管理
5. **URL生成**：创建预签名URL以安全访问图像
6. **类型安全**：完整的TypeScript支持和综合数据验证

### 🏗️ 架构图

```
┌─────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  客户端请求  │───▶│  NestJS控制器   │───▶│  数据验证与转换  │
└─────────────┘    └─────────────────┘    └─────────────────┘
                                                    │
┌─────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ JSON响应     │◀───│   预签名URL     │◀───│  图表渲染服务   │
└─────────────┘    └─────────────────┘    └─────────────────┘
                                                    │
┌─────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  MinIO存储   │◀───│ Canvas图像生成  │◀───│@antv/gpt-vis-ssr│
└─────────────┘    └─────────────────┘    └─────────────────┘
```

**数据流程：**
1. 客户端发送图表请求
2. NestJS控制器接收请求
3. 数据验证与类型转换
4. 图表渲染服务处理
5. @antv/gpt-vis-ssr生成图表
6. Canvas转换为PNG图像
7. 上传到MinIO对象存储
8. 生成预签名访问URL
9. 返回JSON响应给客户端

### 🚀 性能与可扩展性

- ⚡ **快速渲染**：使用@antv/gpt-vis-ssr优化的服务器端渲染
- 📈 **可扩展存储**：MinIO提供企业级对象存储
- 🔄 **异步处理**：非阻塞的图表生成管道
- 💾 **内存高效**：流式文件上传和自动清理
- 🛡️ **错误处理**：具有详细日志记录的综合错误处理

### 🔍 故障排除

#### Canvas安装问题
如果遇到Canvas编译错误：
1. 确保已安装系统依赖
2. 清除npm缓存：`npm cache clean --force`
3. 删除node_modules并重新安装：`rm -rf node_modules && npm install`
4. 在Apple Silicon Mac上可能需要：`arch -x86_64 npm install canvas`

#### MinIO连接问题
1. 验证MinIO服务器正在运行：`docker run -p 9000:9000 -p 9001:9001 minio/minio server /data --console-address ":9001"`
2. 检查网络连接和防火墙设置
3. 验证`.env`文件中的凭据
4. 确保存储桶权限配置正确

#### 图表渲染问题
1. 检查应用日志以获取详细错误信息
2. 验证输入数据格式是否与预期架构匹配
3. 使用测试仪表板调试各个图表类型
4. 确保已安装Canvas的所有系统依赖

### 🤝 贡献

我们欢迎贡献！请遵循以下步骤：

1. Fork仓库
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m '添加了很棒的功能'`
4. 推送到分支：`git push origin feature/amazing-feature`
5. 开启Pull Request

#### 开发指南
- 遵循TypeScript最佳实践
- 为新图表类型添加测试
- 更新API更改的文档
- 确保所有测试通过：`npm run test`

## ❓ 常见问题

### Q: 为什么选择@antv/gpt-vis-ssr而不是其他图表库？
A: @antv/gpt-vis-ssr提供了优秀的服务器端渲染能力，支持多种图表类型，且专门为服务器环境优化，无需浏览器环境即可生成高质量图表。

### Q: 可以自定义图表样式吗？
A: 是的，每个图表类型都支持丰富的自定义选项，包括颜色、主题、尺寸等。详见API文档。

### Q: 支持哪些图片格式？
A: 目前主要支持PNG格式，具有良好的质量和兼容性。

### Q: 如何处理大量并发请求？
A: 项目基于NestJS构建，天然支持异步处理。建议配合负载均衡和Redis缓存使用。

### Q: MinIO可以替换为其他对象存储吗？
A: 理论上可以，需要修改MinIO服务的实现。MinIO兼容AWS S3 API，是一个稳定的选择。

### 📝 更新日志

### v1.0.0 (2025-06-27)
- ✅ 支持22种图表类型，100%通过测试
- ✅ 完整的TypeScript类型支持和数据验证
- ✅ 自动化测试套件和可视化测试仪表板
- ✅ 详细的OpenAPI文档和示例
- ✅ Docker Compose一键部署
- ✅ 完善的中英文README文档

### 📄 许可证

本项目采用MIT许可证 - 详见[LICENSE](LICENSE)文件。

### 🙏 致谢

- [AntV](https://antv.vision/) 提供的优秀图表库
- [NestJS](https://nestjs.com/) 提供的强大框架
- [MinIO](https://min.io/) 提供的可靠对象存储
- 所有帮助改进此项目的贡献者

---

**🌟 如果这个项目对你有帮助，请给个Star支持一下！**

---

## English

### 🎯 Motivation

As data visualization becomes increasingly important in modern applications, developers often struggle with:

- **Complex Chart Integration**: Setting up chart libraries with server-side rendering
- **Storage Management**: Handling chart image storage and URL generation
- **Type Safety**: Ensuring proper data validation for different chart types
- **API Consistency**: Providing a unified interface for multiple chart types

This project provides a comprehensive **NestJS-based chart generation service** that combines the power of `@antv/gpt-vis-ssr` for chart rendering with **MinIO** for reliable cloud storage, offering developers a production-ready solution for chart generation APIs.

### ✨ Features

- 🎨 **22+ Chart Types**: Support for all major chart types including basic charts, advanced visualizations, and relationship diagrams
- 🚀 **High Performance**: Server-side rendering with optimized image generation
- ☁️ **Cloud Storage**: Seamless integration with MinIO for scalable file storage
- 🛡️ **Type Safety**: Full TypeScript support with comprehensive data validation
- 🔧 **Easy Integration**: RESTful APIs with OpenAPI documentation
- 🧪 **Comprehensive Testing**: Automated test suite with visual dashboard
- 📊 **Production Ready**: Built with NestJS for enterprise-grade applications

### 📈 Supported Chart Types

#### Basic Charts (6 types)
- `line` - Line Chart
- `area` - Area Chart  
- `column` - Column Chart
- `bar` - Bar Chart
- `pie` - Pie Chart
- `scatter` - Scatter Plot

#### Advanced Charts (11 types)
- `histogram` - Histogram
- `boxplot` - Box Plot
- `radar` - Radar Chart
- `funnel` - Funnel Chart
- `treemap` - Treemap
- `sankey` - Sankey Diagram
- `word-cloud` - Word Cloud
- `dual-axes` - Dual Axis Chart
- `liquid` - Liquid Fill Chart
- `violin` - Violin Plot
- `venn` - Venn Diagram

#### Relationship Charts (5 types)
- `mind-map` - Mind Map
- `organization-chart` - Organization Chart
- `flow-diagram` - Flow Diagram
- `fishbone-diagram` - Fishbone Diagram
- `network-graph` - Network Graph

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MinIO server running (local or remote)
- **System dependencies for @antv/gpt-vis-ssr (Canvas rendering)**:
  - macOS: `brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman`
  - Ubuntu/Debian: `sudo apt-get install pkg-config libcairo2-dev libpango1.0-dev libpng-dev libjpeg-dev libgif-dev librsvg2-dev libpixman-1-dev`
  - CentOS/RHEL: `sudo yum install pkgconfig cairo-devel pango-devel libpng-devel libjpeg-devel giflib-devel librsvg2-devel pixman-devel`

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mcp-server-chart-minio
```

2. Start MinIO service (using Docker):
```bash
docker-compose up -d
```

3. Install system dependencies (required for Canvas):
```bash
# macOS
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman

# Ubuntu/Debian
sudo apt-get install pkg-config libcairo2-dev libpango1.0-dev libpng-dev libjpeg-dev libgif-dev librsvg2-dev libpixman-1-dev

# CentOS/RHEL
sudo yum install pkgconfig cairo-devel pango-devel libpng-devel libjpeg-devel giflib-devel librsvg2-devel pixman-devel
```

4. Install dependencies:
```bash
npm install
```

5. Configure environment variables:
```bash
cp .env.example .env
```

Edit the `.env` file with your MinIO configuration (if using Docker Compose, you can keep the default values):
```env
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=charts
PORT=3000
```

## Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

## Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

The application will be available at:
- API: `http://localhost:3000`
- API Documentation: `http://localhost:3000/api/docs`
- MinIO Console: `http://localhost:9001` (admin/minioadmin)

## Quick Start

1. **Start the services:**
```bash
# Start MinIO
docker-compose up -d

# Start the application
npm run start:dev
```

2. **Test a basic chart:**
```bash
curl -X POST http://localhost:3000/api/chart-generators/line \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      {"time": "Jan", "value": 100},
      {"time": "Feb", "value": 120},
      {"time": "Mar", "value": 140}
    ],
    "title": "Quick Test Chart"
  }'
```

3. **Open the test dashboard:**
```bash
open test-dashboard.html
```

4. **View API documentation:**
   Visit `http://localhost:3000/api/docs` for interactive API testing

## API Endpoints

### Health Check
- `GET /api/health` - Application health status

### Chart Operations
- `POST /api/chart/render` - Render chart and upload to MinIO
- `GET /api/chart/types` - Get supported chart types
- `GET /api/chart/sample` - Generate sample chart

### MinIO Operations
- `GET /api/minio/buckets` - List all buckets
- `POST /api/minio/buckets` - Create a new bucket
- `DELETE /api/minio/buckets/:bucketName` - Delete a bucket
- `GET /api/minio/buckets/:bucketName/objects` - List objects in a bucket

## Chart Rendering Examples

### Basic Line Chart
```bash
curl -X POST http://localhost:3000/api/chart/render \
  -H "Content-Type: application/json" \
  -d '{
    "type": "line",
    "data": [
      {"time": "2020", "value": 100},
      {"time": "2021", "value": 120},
      {"time": "2022", "value": 140}
    ],
    "title": "Sample Line Chart"
  }'
```

### Pie Chart
```bash
curl -X POST http://localhost:3000/api/chart/render \
  -H "Content-Type: application/json" \
  -d '{
    "type": "pie",
    "data": [
      {"category": "A", "value": 30},
      {"category": "B", "value": 25},
      {"category": "C", "value": 45}
    ],
    "title": "Sample Pie Chart"
  }'
```

### Generate Sample Chart
```bash
# Generate a sample line chart
curl "http://localhost:3000/api/chart/sample?type=line&theme=default"
```

## Chart Generators API

The project provides dedicated endpoints for each chart type with optimized data processing:

### Basic Charts
- `POST /api/chart-generators/line` - Line Chart
- `POST /api/chart-generators/area` - Area Chart
- `POST /api/chart-generators/column` - Column Chart
- `POST /api/chart-generators/bar` - Bar Chart
- `POST /api/chart-generators/pie` - Pie Chart
- `POST /api/chart-generators/scatter` - Scatter Plot

### Advanced Charts
- `POST /api/chart-generators/histogram` - Histogram
- `POST /api/chart-generators/boxplot` - Box Plot
- `POST /api/chart-generators/radar` - Radar Chart
- `POST /api/chart-generators/funnel` - Funnel Chart
- `POST /api/chart-generators/treemap` - Treemap
- `POST /api/chart-generators/sankey` - Sankey Diagram
- `POST /api/chart-generators/word-cloud` - Word Cloud
- `POST /api/chart-generators/dual-axes` - Dual Axis Chart
- `POST /api/chart-generators/liquid` - Liquid Fill Chart
- `POST /api/chart-generators/violin` - Violin Plot
- `POST /api/chart-generators/venn` - Venn Diagram

### Relationship Charts
- `POST /api/chart-generators/mind-map` - Mind Map
- `POST /api/chart-generators/organization-chart` - Organization Chart
- `POST /api/chart-generators/flow-diagram` - Flow Diagram
- `POST /api/chart-generators/fishbone-diagram` - Fishbone Diagram
- `POST /api/chart-generators/network-graph` - Network Graph

### Complex Chart Examples

#### Dual Axes Chart
```bash
curl -X POST http://localhost:3000/api/chart-generators/dual-axes \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      {"time": "2020", "value1": 100, "value2": 50},
      {"time": "2021", "value1": 120, "value2": 60},
      {"time": "2022", "value1": 140, "value2": 45}
    ],
    "title": "Sales vs Profit"
  }'
```

#### Flow Diagram
```bash
curl -X POST http://localhost:3000/api/chart-generators/flow-diagram \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "nodes": [
        {"id": "start", "label": "Start"},
        {"id": "process", "label": "Process"},
        {"id": "end", "label": "End"}
      ],
      "edges": [
        {"source": "start", "target": "process"},
        {"source": "process", "target": "end"}
      ]
    },
    "title": "Sample Flow"
  }'
```

#### Sankey Diagram
```bash
curl -X POST http://localhost:3000/api/chart-generators/sankey \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      {"source": "A", "target": "B", "value": 10},
      {"source": "B", "target": "C", "value": 15},
      {"source": "A", "target": "C", "value": 5}
    ],
    "title": "Energy Flow"
  }'
```

## Testing

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## Development

```bash
# Format code
npm run format

# Lint code
npm run lint

# Watch mode
npm run start:dev
```

### Automated Testing

The project includes comprehensive testing tools:

```bash
# Run all chart tests
node test-all-charts.js

# Run critical fixes test
node test-critical-fixes.js

# Open visual test dashboard
open test-dashboard.html
```

### Visual Test Dashboard

The project includes a beautiful HTML dashboard (`test-dashboard.html`) for interactive testing:
- 🎨 Test all 22 chart types with real-time preview
- 📊 Sample data generation for each chart type
- 🔍 Response inspection and error handling
- 💡 Modern, responsive UI with dark theme

## Project Structure

```
src/
├── main.ts                           # Application entry point
├── app.module.ts                     # Root module
├── app.controller.ts                 # Root controller
├── app.service.ts                    # Root service
├── chart/                           # Chart rendering module
│   ├── chart.module.ts
│   ├── chart.controller.ts
│   └── chart-render.service.ts       # Core chart rendering logic
├── chart-generators/                # Chart API endpoints
│   ├── chart-generators.controller.ts # 22+ chart type endpoints
│   ├── chart-generators.module.ts
│   └── dto/
│       └── chart-generators.dto.ts   # TypeScript DTOs for all chart types
├── minio/                           # MinIO integration
│   ├── minio.module.ts
│   ├── minio.service.ts
│   └── minio.controller.ts
└── docs/                           # API documentation
    └── chart.md
```

## API Documentation

This project provides full OpenAPI/Swagger documentation with:
- 📝 Detailed parameter descriptions for all 22 chart types
- 💡 Interactive examples and sample data
- 🔒 Request/response schemas with TypeScript DTOs
- 🧪 Built-in API testing interface

Access the documentation at: `http://localhost:3000/api/docs`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MINIO_ENDPOINT` | MinIO server endpoint | `localhost` |
| `MINIO_PORT` | MinIO server port | `9000` |
| `MINIO_USE_SSL` | Use SSL connection | `false` |
| `MINIO_ACCESS_KEY` | MinIO access key | `minioadmin` |
| `MINIO_SECRET_KEY` | MinIO secret key | `minioadmin` |
| `MINIO_BUCKET_NAME` | Default bucket name | `charts` |
| `PORT` | Application port | `3000` |

## How It Works

1. **Chart Rendering**: Uses `@antv/gpt-vis-ssr` for server-side chart rendering
2. **Data Processing**: Transforms input data to match each chart type's requirements
3. **Image Generation**: Converts chart to PNG buffer using Canvas
4. **Cloud Storage**: Uploads image to MinIO object storage with automatic bucket management
5. **URL Generation**: Creates presigned URLs for secure image access
6. **Type Safety**: Full TypeScript support with comprehensive data validation

## Architecture

```
┌─────────────┐    ┌─────────────────┐    ┌─────────────────┐
│Client Request│───▶│NestJS Controller│───▶│Data Validation &│
│             │    │                 │    │ Transformation  │
└─────────────┘    └─────────────────┘    └─────────────────┘
                                                    │
┌─────────────┐    ┌─────────────────┐    ┌─────────────────┐
│JSON Response│◀───│  Presigned URL  │◀───│Chart Render     │
│             │    │                 │    │Service          │
└─────────────┘    └─────────────────┘    └─────────────────┘
                                                    │
┌─────────────┐    ┌─────────────────┐    ┌─────────────────┐
│MinIO Storage│◀───│Canvas Image     │◀───│@antv/gpt-vis-ssr│
│             │    │Generation       │    │                 │
└─────────────┘    └─────────────────┘    └─────────────────┘
```

**Data Flow:**
1. Client sends chart request
2. NestJS controller receives request
3. Data validation and type transformation
4. Chart render service processes request
5. @antv/gpt-vis-ssr generates chart
6. Canvas converts to PNG image
7. Upload to MinIO object storage
8. Generate presigned access URL
9. Return JSON response to client

## Performance & Scalability

- ⚡ **Fast Rendering**: Optimized server-side rendering with @antv/gpt-vis-ssr
- 📈 **Scalable Storage**: MinIO provides enterprise-grade object storage
- 🔄 **Async Processing**: Non-blocking chart generation pipeline
- 💾 **Memory Efficient**: Streaming file uploads and automatic cleanup
- 🛡️ **Error Handling**: Comprehensive error handling with detailed logging

## Troubleshooting

### Canvas Installation Issues
If you encounter Canvas compilation errors:
1. Ensure system dependencies are installed
2. Clear npm cache: `npm cache clean --force`
3. Delete node_modules and reinstall: `rm -rf node_modules && npm install`
4. On Apple Silicon Macs, you may need: `arch -x86_64 npm install canvas`

### MinIO Connection Issues
1. Verify MinIO server is running: `docker run -p 9000:9000 -p 9001:9001 minio/minio server /data --console-address ":9001"`
2. Check network connectivity and firewall settings
3. Validate credentials in `.env` file
4. Ensure bucket permissions are correctly configured

### Chart Rendering Issues
1. Check application logs for detailed error messages
2. Verify input data format matches the expected schema
3. Use the test dashboard to debug individual chart types
4. Ensure all system dependencies for Canvas are installed

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Add tests for new chart types
- Update documentation for API changes
- Ensure all tests pass: `npm run test`

## ❓ FAQ

### Q: Why choose @antv/gpt-vis-ssr over other chart libraries?
A: @antv/gpt-vis-ssr provides excellent server-side rendering capabilities, supports multiple chart types, and is specifically optimized for server environments without requiring a browser.

### Q: Can I customize chart styles?
A: Yes, each chart type supports rich customization options including colors, themes, dimensions, and more. See the API documentation for details.

### Q: What image formats are supported?
A: Currently, we primarily support PNG format, which offers good quality and compatibility.

### Q: How to handle high concurrent requests?
A: The project is built on NestJS and naturally supports asynchronous processing. We recommend using it with load balancing and Redis caching.

### Q: Can MinIO be replaced with other object storage?
A: Theoretically yes, but it would require modifying the MinIO service implementation. MinIO is compatible with AWS S3 API and is a stable choice.

## 📝 Changelog

### v1.0.0 (2025-06-27)
- ✅ Support for 22 chart types with 100% test coverage
- ✅ Complete TypeScript support and data validation
- ✅ Automated test suite and visual test dashboard
- ✅ Detailed OpenAPI documentation and examples
- ✅ Docker Compose one-click deployment
- ✅ Comprehensive bilingual README documentation

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [AntV](https://antv.vision/) for the excellent charting library
- [NestJS](https://nestjs.com/) for the robust framework
- [MinIO](https://min.io/) for reliable object storage
- All contributors who helped improve this project

---

**🌟 If this project helps you, please give it a Star!**

## API Endpoints

### Health Check
- `GET /api/health` - Application health status

### Chart Operations
- `POST /api/chart/render` - Render chart and upload to MinIO
- `GET /api/chart/types` - Get supported chart types
- `GET /api/chart/sample` - Generate sample chart

### MinIO Operations
- `GET /api/minio/buckets` - List all buckets
- `POST /api/minio/buckets` - Create a new bucket
- `DELETE /api/minio/buckets/:bucketName` - Delete a bucket
- `GET /api/minio/buckets/:bucketName/objects` - List objects in a bucket

## Chart Rendering Examples

### Basic Line Chart
```bash
curl -X POST http://localhost:3000/api/chart/render \
  -H "Content-Type: application/json" \
  -d '{
    "type": "line",
    "data": [
      {"time": "2020", "value": 100},
      {"time": "2021", "value": 120},
      {"time": "2022", "value": 140}
    ],
    "title": "Sample Line Chart"
  }'
```

### Pie Chart
```bash
curl -X POST http://localhost:3000/api/chart/render \
  -H "Content-Type: application/json" \
  -d '{
    "type": "pie",
    "data": [
      {"category": "A", "value": 30},
      {"category": "B", "value": 25},
      {"category": "C", "value": 45}
    ],
    "title": "Sample Pie Chart"
  }'
```

### Generate Sample Chart
```bash
# Generate a sample line chart
curl "http://localhost:3000/api/chart/sample?type=line&theme=default"
```

## Chart Generators API

The project provides dedicated endpoints for each chart type with optimized data processing:

### Basic Charts
- `POST /api/chart-generators/line` - Line Chart
- `POST /api/chart-generators/area` - Area Chart
- `POST /api/chart-generators/column` - Column Chart
- `POST /api/chart-generators/bar` - Bar Chart
- `POST /api/chart-generators/pie` - Pie Chart
- `POST /api/chart-generators/scatter` - Scatter Plot

### Advanced Charts
- `POST /api/chart-generators/histogram` - Histogram
- `POST /api/chart-generators/boxplot` - Box Plot
- `POST /api/chart-generators/radar` - Radar Chart
- `POST /api/chart-generators/funnel` - Funnel Chart
- `POST /api/chart-generators/treemap` - Treemap
- `POST /api/chart-generators/sankey` - Sankey Diagram
- `POST /api/chart-generators/word-cloud` - Word Cloud
- `POST /api/chart-generators/dual-axes` - Dual Axis Chart
- `POST /api/chart-generators/liquid` - Liquid Fill Chart
- `POST /api/chart-generators/violin` - Violin Plot
- `POST /api/chart-generators/venn` - Venn Diagram

### Relationship Charts
- `POST /api/chart-generators/mind-map` - Mind Map
- `POST /api/chart-generators/organization-chart` - Organization Chart
- `POST /api/chart-generators/flow-diagram` - Flow Diagram
- `POST /api/chart-generators/fishbone-diagram` - Fishbone Diagram
- `POST /api/chart-generators/network-graph` - Network Graph

### Complex Chart Examples

#### Dual Axes Chart
```bash
curl -X POST http://localhost:3000/api/chart-generators/dual-axes \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      {"time": "2020", "value1": 100, "value2": 50},
      {"time": "2021", "value1": 120, "value2": 60},
      {"time": "2022", "value1": 140, "value2": 45}
    ],
    "title": "Sales vs Profit"
  }'
```

#### Flow Diagram
```bash
curl -X POST http://localhost:3000/api/chart-generators/flow-diagram \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "nodes": [
        {"id": "start", "label": "Start"},
        {"id": "process", "label": "Process"},
        {"id": "end", "label": "End"}
      ],
      "edges": [
        {"source": "start", "target": "process"},
        {"source": "process", "target": "end"}
      ]
    },
    "title": "Sample Flow"
  }'
```

#### Sankey Diagram
```bash
curl -X POST http://localhost:3000/api/chart-generators/sankey \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      {"source": "A", "target": "B", "value": 10},
      {"source": "B", "target": "C", "value": 15},
      {"source": "A", "target": "C", "value": 5}
    ],
    "title": "Energy Flow"
  }'
```

## Testing

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## Development

```bash
# Format code
npm run format

# Lint code
npm run lint

# Watch mode
npm run start:dev
```

### Automated Testing

The project includes comprehensive testing tools:

```bash
# Run all chart tests
node test-all-charts.js

# Run critical fixes test
node test-critical-fixes.js

# Open visual test dashboard
open test-dashboard.html
```

### Visual Test Dashboard

The project includes a beautiful HTML dashboard (`test-dashboard.html`) for interactive testing:
- 🎨 Test all 22 chart types with real-time preview
- 📊 Sample data generation for each chart type
- 🔍 Response inspection and error handling
- 💡 Modern, responsive UI with dark theme

## Project Structure

```
src/
├── main.ts                           # Application entry point
├── app.module.ts                     # Root module
├── app.controller.ts                 # Root controller
├── app.service.ts                    # Root service
├── chart/                           # Chart rendering module
│   ├── chart.module.ts
│   ├── chart.controller.ts
│   └── chart-render.service.ts       # Core chart rendering logic
├── chart-generators/                # Chart API endpoints
│   ├── chart-generators.controller.ts # 22+ chart type endpoints
│   ├── chart-generators.module.ts
│   └── dto/
│       └── chart-generators.dto.ts   # TypeScript DTOs for all chart types
├── minio/                           # MinIO integration
│   ├── minio.module.ts
│   ├── minio.service.ts
│   └── minio.controller.ts
└── docs/                           # API documentation
    └── chart.md
```

## API Documentation

This project provides full OpenAPI/Swagger documentation with:
- 📝 Detailed parameter descriptions for all 22 chart types
- 💡 Interactive examples and sample data
- 🔒 Request/response schemas with TypeScript DTOs
- 🧪 Built-in API testing interface

Access the documentation at: `http://localhost:3000/api/docs`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MINIO_ENDPOINT` | MinIO server endpoint | `localhost` |
| `MINIO_PORT` | MinIO server port | `9000` |
| `MINIO_USE_SSL` | Use SSL connection | `false` |
| `MINIO_ACCESS_KEY` | MinIO access key | `minioadmin` |
| `MINIO_SECRET_KEY` | MinIO secret key | `minioadmin` |
| `MINIO_BUCKET_NAME` | Default bucket name | `charts` |
| `PORT` | Application port | `3000` |

## How It Works

1. **Chart Rendering**: Uses `@antv/gpt-vis-ssr` for server-side chart rendering
2. **Data Processing**: Transforms input data to match each chart type's requirements
3. **Image Generation**: Converts chart to PNG buffer using Canvas
4. **Cloud Storage**: Uploads image to MinIO object storage with automatic bucket management
5. **URL Generation**: Creates presigned URLs for secure image access
6. **Type Safety**: Full TypeScript support with comprehensive data validation

## Architecture

```mermaid
graph TD
    A[Client Request] --> B[NestJS Controller]
    B --> C[Data Validation & Transformation]
    C --> D[Chart Render Service]
    D --> E[@antv/gpt-vis-ssr]
    E --> F[Canvas Image Generation]
    F --> G[MinIO Storage]
    G --> H[Presigned URL]
    H --> I[JSON Response]
```

## Performance & Scalability

- ⚡ **Fast Rendering**: Optimized server-side rendering with @antv/gpt-vis-ssr
- 📈 **Scalable Storage**: MinIO provides enterprise-grade object storage
- 🔄 **Async Processing**: Non-blocking chart generation pipeline
- 💾 **Memory Efficient**: Streaming file uploads and automatic cleanup
- 🛡️ **Error Handling**: Comprehensive error handling with detailed logging

## Troubleshooting

### Canvas Installation Issues
If you encounter Canvas compilation errors:
1. Ensure system dependencies are installed
2. Clear npm cache: `npm cache clean --force`
3. Delete node_modules and reinstall: `rm -rf node_modules && npm install`
4. On Apple Silicon Macs, you may need: `arch -x86_64 npm install canvas`

### MinIO Connection Issues
1. Verify MinIO server is running: `docker run -p 9000:9000 -p 9001:9001 minio/minio server /data --console-address ":9001"`
2. Check network connectivity and firewall settings
3. Validate credentials in `.env` file
4. Ensure bucket permissions are correctly configured

### Chart Rendering Issues
1. Check application logs for detailed error messages
2. Verify input data format matches the expected schema
3. Use the test dashboard to debug individual chart types
4. Ensure all system dependencies for Canvas are installed

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Add tests for new chart types
- Update documentation for API changes
- Ensure all tests pass: `npm run test`

## ❓ FAQ

### Q: Why choose @antv/gpt-vis-ssr over other chart libraries?
A: @antv/gpt-vis-ssr provides excellent server-side rendering capabilities, supports multiple chart types, and is specifically optimized for server environments without requiring a browser.

### Q: Can I customize chart styles?
A: Yes, each chart type supports rich customization options including colors, themes, dimensions, and more. See the API documentation for details.

### Q: What image formats are supported?
A: Currently, we primarily support PNG format, which offers good quality and compatibility.

### Q: How to handle high concurrent requests?
A: The project is built on NestJS and naturally supports asynchronous processing. We recommend using it with load balancing and Redis caching.

### Q: Can MinIO be replaced with other object storage?
A: Theoretically yes, but it would require modifying the MinIO service implementation. MinIO is compatible with AWS S3 API and is a stable choice.

## 📝 Changelog

### v1.0.0 (2025-01-27)
- ✅ Support for 22 chart types with 100% test coverage
- ✅ Complete TypeScript support and data validation
- ✅ Automated test suite and visual test dashboard
- ✅ Detailed OpenAPI documentation and examples
- ✅ Docker Compose one-click deployment
- ✅ Comprehensive bilingual README documentation

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [AntV](https://antv.vision/) for the excellent charting library
- [NestJS](https://nestjs.com/) for the robust framework
- [MinIO](https://min.io/) for reliable object storage
- All contributors who helped improve this project

---

**🌟 If this project helps you, please give it a Star!**

---

## 中文

### 🎯 项目动机

随着数据可视化在现代应用中变得越来越重要，开发者经常面临以下挑战：

- **复杂的图表集成**：设置具有服务器端渲染功能的图表库
- **存储管理**：处理图表图像存储和URL生成  
- **类型安全**：确保不同图表类型的数据验证
- **API一致性**：为多种图表类型提供统一接口

本项目提供了一个全面的**基于NestJS的图表生成服务**，结合了`@antv/gpt-vis-ssr`的图表渲染能力和**MinIO**的可靠云存储，为开发者提供了生产就绪的图表生成API解决方案。

### ✨ 特性

- 🎨 **22+图表类型**：支持所有主要图表类型，包括基础图表、高级可视化和关系图表
- 🚀 **高性能**：优化的图像生成和服务器端渲染
- ☁️ **云存储**：与MinIO无缝集成，提供可扩展的文件存储
- 🛡️ **类型安全**：完整的TypeScript支持和综合数据验证
- 🔧 **易于集成**：具有OpenAPI文档的RESTful API
- 🧪 **全面测试**：自动化测试套件和可视化仪表板
- 📊 **生产就绪**：使用NestJS构建的企业级应用

### 📈 支持的图表类型

#### 基础图表 (6种)
- `line` - 折线图
- `area` - 面积图  
- `column` - 柱状图
- `bar` - 条形图
- `pie` - 饼图
- `scatter` - 散点图

#### 高级图表 (11种)
- `histogram` - 直方图
- `boxplot` - 箱线图
- `radar` - 雷达图
- `funnel` - 漏斗图
- `treemap` - 树状图
- `sankey` - 桑基图
- `word-cloud` - 词云图
- `dual-axes` - 双轴图
- `liquid` - 水波图
- `violin` - 小提琴图
- `venn` - 韦恩图

#### 关系图表 (5种)
- `mind-map` - 思维导图
- `organization-chart` - 组织架构图
- `flow-diagram` - 流程图
- `fishbone-diagram` - 鱼骨图
- `network-graph` - 网络图

### 🛠️ 系统要求

- Node.js (v16或更高版本)
- npm或yarn
- 运行中的MinIO服务器（本地或远程）
- **@antv/gpt-vis-ssr的系统依赖（Canvas渲染）**：
  - macOS: `brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman`
  - Ubuntu/Debian: `sudo apt-get install pkg-config libcairo2-dev libpango1.0-dev libpng-dev libjpeg-dev libgif-dev librsvg2-dev libpixman-1-dev`
  - CentOS/RHEL: `sudo yum install pkgconfig cairo-devel pango-devel libpng-devel libjpeg-devel giflib-devel librsvg2-devel pixman-devel`

### 📦 安装

1. 克隆仓库：
```bash
git clone <repository-url>
cd mcp-server-chart-minio
```

2. 启动MinIO服务（使用Docker）：
```bash
docker-compose up -d
```

3. 安装系统依赖（Canvas所需）：
```bash
# macOS
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman

# Ubuntu/Debian
sudo apt-get install pkg-config libcairo2-dev libpango1.0-dev libpng-dev libjpeg-dev libgif-dev librsvg2-dev libpixman-1-dev
```

4. 安装项目依赖：
```bash
npm install
```

5. 配置环境变量：
```bash
cp .env.example .env
```

编辑`.env`文件配置MinIO（如使用Docker Compose，可保持默认值）：
```env
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=charts
PORT=3000
```

### 🚀 运行应用

#### 开发模式
```bash
npm run start:dev
```

#### 生产模式
```bash
npm run build
npm run start:prod
```

应用将在以下地址可用：
- API: `http://localhost:3000`
- API文档: `http://localhost:3000/api/docs`
- MinIO控制台: `http://localhost:9001` (admin/minioadmin)

### ⚡ 快速开始

1. **启动服务：**
```bash
# 启动MinIO
docker-compose up -d

# 启动应用
npm run start:dev
```

2. **测试基础图表：**
```bash
curl -X POST http://localhost:3000/api/chart-generators/line \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      {"time": "一月", "value": 100},
      {"time": "二月", "value": 120},
      {"time": "三月", "value": 140}
    ],
    "title": "快速测试图表"
  }'
```

3. **打开测试仪表板：**
```bash
open test-dashboard.html
```

4. **查看API文档：**
   访问 `http://localhost:3000/api/docs` 进行交互式API测试

### 📊 API示例

#### 基础折线图
```bash
curl -X POST http://localhost:3000/api/chart-generators/line \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      {"time": "2020", "value": 100},
      {"time": "2021", "value": 120},
      {"time": "2022", "value": 140}
    ],
    "title": "销售趋势"
  }'
```

#### 饼图
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

### 🧪 自动化测试

项目包含完整的测试工具：

```bash
# 运行所有图表测试
node test-all-charts.js

# 运行关键修复测试
node test-critical-fixes.js

# 打开可视化测试仪表板
open test-dashboard.html
```

### 🎨 可视化测试仪表板

项目包含精美的HTML仪表板（`test-dashboard.html`）用于交互式测试：
- 🎨 测试所有22种图表类型并实时预览
- 📊 为每种图表类型生成示例数据
- 🔍 响应检查和错误处理
- 💡 现代响应式UI和深色主题

### 🏗️ 项目架构

```
src/
├── main.ts                           # 应用入口点
├── app.module.ts                     # 根模块
├── chart-generators/                # 图表API端点
│   ├── chart-generators.controller.ts # 22+图表类型端点
│   ├── chart-generators.module.ts
│   └── dto/
│       └── chart-generators.dto.ts   # 所有图表类型的TypeScript DTO
├── chart/                           # 图表渲染模块
│   ├── chart.module.ts
│   ├── chart.controller.ts
│   └── chart-render.service.ts       # 核心图表渲染逻辑
└── minio/                           # MinIO集成
    ├── minio.module.ts
    ├── minio.service.ts
    └── minio.controller.ts
```

### 🔧 工作原理

1. **图表渲染**：使用`@antv/gpt-vis-ssr`进行服务器端图表渲染
2. **数据处理**：转换输入数据以匹配每种图表类型的要求
3. **图像生成**：使用Canvas将图表转换为PNG缓冲区
4. **云存储**：将图像上传到MinIO对象存储，支持自动存储桶管理
5. **URL生成**：创建预签名URL以安全访问图像
6. **类型安全**：完整的TypeScript支持和综合数据验证

### 🚀 性能与可扩展性

- ⚡ **快速渲染**：使用@antv/gpt-vis-ssr优化的服务器端渲染
- 📈 **可扩展存储**：MinIO提供企业级对象存储
- 🔄 **异步处理**：非阻塞的图表生成管道
- 💾 **内存高效**：流式文件上传和自动清理
- 🛡️ **错误处理**：具有详细日志记录的综合错误处理

### 🔍 故障排除

#### Canvas安装问题
如果遇到Canvas编译错误：
1. 确保已安装系统依赖
2. 清除npm缓存：`npm cache clean --force`
3. 删除node_modules并重新安装：`rm -rf node_modules && npm install`
4. 在Apple Silicon Mac上可能需要：`arch -x86_64 npm install canvas`

#### MinIO连接问题
1. 验证MinIO服务器正在运行
2. 检查网络连接和防火墙设置
3. 验证`.env`文件中的凭据
4. 确保存储桶权限配置正确

### 🤝 贡献

我们欢迎贡献！请遵循以下步骤：

1. Fork仓库
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送到分支：`git push origin feature/amazing-feature`
5. 开启Pull Request

## ❓ 常见问题

### Q: 为什么选择@antv/gpt-vis-ssr而不是其他图表库？
A: @antv/gpt-vis-ssr提供了优秀的服务器端渲染能力，支持多种图表类型，且专门为服务器环境优化，无需浏览器环境即可生成高质量图表。

### Q: 可以自定义图表样式吗？
A: 是的，每个图表类型都支持丰富的自定义选项，包括颜色、主题、尺寸等。详见API文档。

### Q: 支持哪些图片格式？
A: 目前主要支持PNG格式，具有良好的质量和兼容性。

### Q: 如何处理大量并发请求？
A: 项目基于NestJS构建，天然支持异步处理。建议配合负载均衡和Redis缓存使用。

### Q: MinIO可以替换为其他对象存储吗？
A: 理论上可以，需要修改MinIO服务的实现。MinIO兼容AWS S3 API，是一个稳定的选择。

## 📝 更新日志

### v1.0.0 (2025-01-27)
- ✅ 支持22种图表类型，100%通过测试
- ✅ 完整的TypeScript类型支持和数据验证
- ✅ 自动化测试套件和可视化测试仪表板
- ✅ 详细的OpenAPI文档和示例
- ✅ Docker Compose一键部署
- ✅ 完善的中英文README文档

### 📄 许可证

本项目采用MIT许可证 - 详见[LICENSE](LICENSE)文件。

### 🙏 致谢

- [AntV](https://antv.vision/) 提供的优秀图表库
- [NestJS](https://nestjs.com/) 提供的强大框架
- [MinIO](https://min.io/) 提供的可靠对象存储
- 所有帮助改进此项目的贡献者

---

**🌟 如果这个项目对你有帮助，请给个Star支持一下！**
