import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // Set global prefix
  app.setGlobalPrefix('api');
  
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('MCP Server Chart MinIO API')
    .setDescription('API documentation for MCP Server Chart MinIO - A NestJS-based server for MinIO object storage operations and chart rendering using @antv/gpt-vis-ssr')
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Default local server')
    .addServer('http://localhost:9000', 'MinIO API server')
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
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation available at: http://localhost:${port}/api/docs`);
  console.log(`Swagger JSON specification available at: http://localhost:${port}/api/docs-json`);
}

bootstrap();
