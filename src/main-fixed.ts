import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // Set global prefix
  app.setGlobalPrefix('api');
  
  // 配置变量
  const port = process.env.PORT || 3000;
  const publicUrl = process.env.PUBLIC_API_URL;
  
  // Swagger configuration
  const configBuilder = new DocumentBuilder()
    .setTitle('MCP Server Chart MinIO API')
    .setDescription('API documentation for MCP Server Chart MinIO - A NestJS-based server for MinIO object storage operations and chart rendering using @antv/gpt-vis-ssr')
    .setVersion('1.0');
  
  // 动态添加服务器配置
  if (publicUrl) {
    // 如果设置了公网URL，优先使用
    configBuilder.addServer(publicUrl, 'Public server');
  }
  
  // 始终添加localhost作为备选
  configBuilder.addServer(`http://localhost:${port}`, 'Local server');
  
  const config = configBuilder
    .addTag('chart', 'Chart rendering operations')
    .addTag('chart-generators', 'Chart generator endpoints for specific chart types')
    .addTag('minio', 'MinIO operations')
    .addTag('health', 'Health check endpoints')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  
  // Setup Swagger UI
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'MCP Server Chart MinIO API Docs',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });
  
  // Add JSON endpoint for Swagger specification
  app.getHttpAdapter().get('/api/docs-json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(document);
  });
  
  const host = process.env.HOST || '0.0.0.0'; // Allow external connections in Docker
  
  await app.listen(port, host);
  
  const displayUrl = publicUrl || `http://localhost:${port}`;
  console.log(`Application is running on: ${displayUrl}`);
  console.log(`Internal server listening on: http://${host}:${port}`);
  console.log(`Swagger documentation available at: ${displayUrl}/api/docs`);
  console.log(`Swagger JSON specification available at: ${displayUrl}/api/docs-json`);
}

bootstrap();
