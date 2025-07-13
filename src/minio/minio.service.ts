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
        
        // 设置存储桶为公共读取策略，允许外部访问图片
        await this.setBucketPublicReadPolicy(bucketName);
        
        return { message: `Bucket '${bucketName}' created successfully` };
      } else {
        // 即使存储桶已存在，也要确保策略正确
        await this.setBucketPublicReadPolicy(bucketName);
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
   * 生成公共访问URL（当存储桶设置了公共读取策略时）
   * 这种方式生成的URL是永久有效的，不需要预签名
   */
  async getPublicUrl(bucketName: string, objectName: string): Promise<string> {
    try {
      const protocol = this.useSSL ? 'https' : 'http';
      const url = `${protocol}://${this.externalEndpoint}:${this.externalPort}/${bucketName}/${objectName}`;
      this.logger.debug(`Generated public URL: ${url}`);
      return url;
    } catch (error) {
      this.logger.error(`Error generating public URL for '${objectName}':`, error);
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

  /**
   * 设置存储桶的公共读取策略
   * 允许匿名用户读取存储桶中的所有对象
   */
  private async setBucketPublicReadPolicy(bucketName: string) {
    try {
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${bucketName}/*`]
          }
        ]
      };

      await this.minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
      this.logger.log(`Public read policy set for bucket '${bucketName}'`);
    } catch (error) {
      this.logger.warn(`Failed to set public policy for bucket '${bucketName}':`, error.message);
      // 不抛出错误，因为这不是致命的
    }
  }

  getClient(): Minio.Client {
    return this.minioClient;
  }
}
