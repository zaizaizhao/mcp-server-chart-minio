# Multi-stage build for MCP Server Chart MinIO
FROM node:20-alpine AS builder

# Install system dependencies required for Canvas rendering (Alpine版本)
RUN apk add --no-cache \
 font-noto-cjk \
 font-noto-emoji \
 font-noto \
 build-base \
 cairo-dev \
 pango-dev \
 jpeg-dev \
 giflib-dev \
 librsvg-dev \
 pkgconfig \
 python3 \
 make \
 g++ \
 pixman-dev

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Set environment variables for Canvas compilation
ENV PYTHON=/usr/bin/python3
ENV CANVAS_PREBUILT=false
RUN npm ci --loglevel=verbose && \
 echo "依赖安装完成，清理缓存..." && \
 npm cache clean --force && \
 rm -rf /tmp/* /var/cache/apk/*

# Copy source code
COPY . .
RUN npm install @nestjs/cli -g
# Build the application
RUN npm run build
# Create non-root user (Alpine使用addgroup和adduser)
RUN addgroup -g 1001 -S nodejs && \
 adduser -S -D -H -u 1001 -s /sbin/nologin -G nodejs nestjs

# Copy built application and node_modules from builder stage


# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
 CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start the application
CMD ["node", "dist/main.js"]
