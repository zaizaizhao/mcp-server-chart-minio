import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService {
  private readonly logger = new Logger(MinioService.name);
  private minioClient: Minio.Client;
  private externalEndpoint: string;
  private externalPort: number;
  private useSSL: boolean;

  constructor(private configService: ConfigService) {
    this.initializeMinioClient();
  }

  private initializeMinioClient() {
    const endPoint = this.configService.get<string>('MINIO_ENDPOINT', 'localhost');
    const port = parseInt(this.configService.get<string>('MINIO_PORT', '9000'));
    this.useSSL = this.configService.get<string>('MINIO_USE_SSL', 'false') === 'true';
    const accessKey = this.configService.get<string>('MINIO_ACCESS_KEY', 'minioadmin');
    const secretKey = this.configService.get<string>('MINIO_SECRET_KEY', 'minioadmin');

    // 外部访问端点配置，用于生成可外部访问的URL
    this.externalEndpoint = this.configService.get<string>('MINIO_EXTERNAL_ENDPOINT', endPoint);
    this.externalPort = parseInt(this.configService.get<string>('MINIO_EXTERNAL_PORT', port.toString()));

    this.minioClient = new Minio.Client({
      endPoint,
      port,
      useSSL: this.useSSL,
      accessKey,
      secretKey,
    });

    this.logger.log(`MinIO client initialized with endpoint: ${endPoint}:${port}`);
    if (this.externalEndpoint !== endPoint || this.externalPort !== port) {
      this.logger.log(`External access configured: ${this.externalEndpoint}:${this.externalPort}`);
    }
  }

  async listBuckets() {
    try {
      const buckets = await this.minioClient.listBuckets();
      return buckets;
    } catch (error) {
      this.logger.error('Error listing buckets:', error);
      throw error;
    }
  }

  async createBucket(bucketName: string, region?: string) {
    try {
      const exists = await this.minioClient.bucketExists(bucketName);
      if (!exists) {
        // 如果没有提供region，使用默认值
        const bucketRegion = region || 'us-east-1';
        await this.minioClient.makeBucket(bucketName, bucketRegion);
        this.logger.log(`Bucket '${bucketName}' created successfully`);
        return { message: `Bucket '${bucketName}' created successfully` };
      } else {
        return { message: `Bucket '${bucketName}' already exists` };
      }
    } catch (error) {
      this.logger.error(`Error creating bucket '${bucketName}':`, error);
      throw error;
    }
  }

  async deleteBucket(bucketName: string) {
    try {
      await this.minioClient.removeBucket(bucketName);
      this.logger.log(`Bucket '${bucketName}' deleted successfully`);
      return { message: `Bucket '${bucketName}' deleted successfully` };
    } catch (error) {
      this.logger.error(`Error deleting bucket '${bucketName}':`, error);
      throw error;
    }
  }

  async listObjects(bucketName: string, prefix?: string) {
    try {
      const objectStream = this.minioClient.listObjects(bucketName, prefix, true);
      const objects = [];
      
      return new Promise((resolve, reject) => {
        objectStream.on('data', (obj) => objects.push(obj));
        objectStream.on('error', reject);
        objectStream.on('end', () => resolve(objects));
      });
    } catch (error) {
      this.logger.error(`Error listing objects in bucket '${bucketName}':`, error);
      throw error;
    }
  }

  /**
   * 生成外部可访问的预签名URL
   * 解决Docker部署时URL使用容器名而非外部IP的问题
   */
  async getExternalPresignedUrl(bucketName: string, objectName: string, expiry: number = 24 * 60 * 60): Promise<string> {
    try {
      // 首先获取内部预签名URL
      const internalUrl = await this.minioClient.presignedGetObject(bucketName, objectName, expiry);
      
      // 如果配置了外部端点，替换URL中的域名和端口
      if (this.externalEndpoint && this.externalEndpoint !== this.configService.get<string>('MINIO_ENDPOINT', 'localhost')) {
        const url = new URL(internalUrl);
        url.hostname = this.externalEndpoint;
        url.port = this.externalPort.toString();
        
        this.logger.debug(`URL transformed: ${internalUrl} -> ${url.toString()}`);
        return url.toString();
      }
      
      return internalUrl;
    } catch (error) {
      this.logger.error(`Error generating external presigned URL for '${objectName}':`, error);
      throw error;
    }
  }

  getClient(): Minio.Client {
    return this.minioClient;
  }
}
