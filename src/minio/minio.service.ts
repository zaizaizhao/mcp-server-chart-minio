import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService {
  private readonly logger = new Logger(MinioService.name);
  private minioClient: Minio.Client;

  constructor(private configService: ConfigService) {
    this.initializeMinioClient();
  }

  private initializeMinioClient() {
    const endPoint = this.configService.get<string>('MINIO_ENDPOINT', 'localhost');
    const port = parseInt(this.configService.get<string>('MINIO_PORT', '9000'));
    const useSSL = this.configService.get<string>('MINIO_USE_SSL', 'false') === 'true';
    const accessKey = this.configService.get<string>('MINIO_ACCESS_KEY', 'minioadmin');
    const secretKey = this.configService.get<string>('MINIO_SECRET_KEY', 'minioadmin');

    this.minioClient = new Minio.Client({
      endPoint,
      port,
      useSSL,
      accessKey,
      secretKey,
    });

    this.logger.log(`MinIO client initialized with endpoint: ${endPoint}:${port}`);
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

  getClient(): Minio.Client {
    return this.minioClient;
  }
}
