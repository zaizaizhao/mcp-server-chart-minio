import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const originalAutoCreateBucket = process.env.MINIO_AUTO_CREATE_BUCKET;

  beforeEach(() => {
    process.env.MINIO_AUTO_CREATE_BUCKET = 'false';
  });

  afterEach(async () => {
    await app?.close();

    if (originalAutoCreateBucket === undefined) {
      delete process.env.MINIO_AUTO_CREATE_BUCKET;
      return;
    }

    process.env.MINIO_AUTO_CREATE_BUCKET = originalAutoCreateBucket;
  });

  beforeEach(async () => {
    jest.resetModules();
    const { AppModule } = await import('./../src/app.module');
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello World! Welcome to MCP Server Chart MinIO!');
  });

  it('/health (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('service', 'MCP Server Chart MinIO');
    expect(response.body).toHaveProperty('timestamp');
  });
});
