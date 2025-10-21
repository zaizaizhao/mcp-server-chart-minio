# Multi-stage build for MCP Server Chart MinIO
FROM node:20-alpine AS builder

# 使用 HTTP 协议的国内镜像源（避免 SSL 证书问题）
RUN sed -i 's/https/http/g' /etc/apk/repositories && \
    sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# Install build dependencies for Canvas
RUN apk add --no-cache \
    build-base \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev \
    librsvg-dev \
    pixman-dev \
    pkgconfig \
    python3 \
    make \
    g++

# Set working directory
WORKDIR /app

# 配置 npm 使用国内镜像并禁用严格 SSL
RUN npm config set registry https://registry.npmmirror.com && \
    npm config set strict-ssl false

# Copy package files
COPY package*.json ./

# Set environment variables for Canvas compilation
ENV PYTHON=/usr/bin/python3
ENV CANVAS_PREBUILT=false

# Install dependencies
RUN npm ci --loglevel=verbose

# Copy source code
COPY . .

# Build the application
RUN npm run build

# ============================================
# Production stage
# ============================================
FROM node:20-alpine

# 使用 HTTP 协议的国内镜像源
RUN sed -i 's/https/http/g' /etc/apk/repositories && \
    sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# Install runtime dependencies for Canvas (不需要 dev 包)
RUN apk add --no-cache \
    cairo \
    pango \
    jpeg \
    giflib \
    librsvg \
    pixman \
    font-noto-cjk \
    font-noto-emoji \
    font-noto \
    wget

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -D -H -u 1001 -s /sbin/nologin -G nodejs nestjs

WORKDIR /app

# Copy built application and node_modules from builder
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start the application
CMD ["node", "dist/main.js"]
