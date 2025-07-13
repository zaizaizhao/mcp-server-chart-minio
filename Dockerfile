# Multi-stage build for MCP Server Chart MinIO
FROM node:20 AS builder

# Install system dependencies required for Canvas rendering (官网推荐)
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    pkg-config \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Set environment variables for Canvas compilation
ENV PYTHON=/usr/bin/python3
ENV CANVAS_PREBUILT=false
ENV NODE_ENV=development

# Install dependencies with verbose output
# set ali mirror to speed up npm install
RUN echo "开始安装依赖..." && \
    npm ci --loglevel=verbose && \
    echo "依赖安装完成，清理缓存..." && \
    npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20 AS production

# Install runtime dependencies for Canvas
RUN apt-get update && apt-get install -y \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libjpeg62-turbo \
    libgif7 \
    librsvg2-2 \
    libfontconfig1 \
    fonts-noto \
    fonts-noto-cjk \
    fonts-noto-color-emoji \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Create non-root user
RUN groupadd -r nodejs --gid=1001 && \
    useradd -r -g nodejs --uid=1001 nestjs

# Copy built application and node_modules from builder stage
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
