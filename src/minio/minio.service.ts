import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

interface EnsureBucketOptions {
  applyPublicReadPolicy?: boolean;
  region?: string;
}

@Injectable()
export class MinioService {
  private readonly logger = new Logger(MinioService.name);
  private minioClient: Minio.Client;
  private readonly bucketPublicReadAccess = new Map<string, boolean>();
  private externalEndpoint: string;
  private externalPort: number;
  private useSSL: boolean;

  constructor(private configService: ConfigService) {
    this.initializeMinioClient();
  }

  private initializeMinioClient() {
    const endPoint = this.configService.get<string>('MINIO_ENDPOINT', 'localhost');
    const port = this.getNumberConfig('MINIO_PORT', 9000);
    this.useSSL = this.getBooleanConfig('MINIO_USE_SSL', false);
    const accessKey = this.configService.get<string>('MINIO_ACCESS_KEY', 'minioadmin');
    const secretKey = this.configService.get<string>('MINIO_SECRET_KEY', 'minioadmin');

    // 外部访问端点配置，用于生成可外部访问的URL
    this.externalEndpoint = this.configService.get<string>('MINIO_EXTERNAL_ENDPOINT', endPoint);
    this.externalPort = this.getNumberConfig('MINIO_EXTERNAL_PORT', port);

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

  async ensureBucket(bucketName: string, options: EnsureBucketOptions = {}): Promise<boolean> {
    const { region = 'us-east-1', applyPublicReadPolicy = false } = options;
    const exists = await this.minioClient.bucketExists(bucketName);

    if (!exists) {
      await this.minioClient.makeBucket(bucketName, region);
      this.logger.log(`Bucket '${bucketName}' created successfully`);
    } else {
      this.logger.log(`Bucket '${bucketName}' already exists`);
    }

    if (applyPublicReadPolicy) {
      return this.setBucketPublicReadPolicy(bucketName);
    }

    return this.refreshBucketAccessMode(bucketName);
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
      await this.ensureBucket(bucketName, {
        region: region || 'us-east-1',
        applyPublicReadPolicy: true,
      });

      return {
        message: exists
          ? `Bucket '${bucketName}' already exists`
          : `Bucket '${bucketName}' created successfully`,
      };
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

  async getObjectAccessUrl(
    bucketName: string,
    objectName: string,
    expiry: number = 24 * 60 * 60,
  ): Promise<string> {
    const shouldUsePublicUrl = await this.hasBucketPublicReadAccess(bucketName);

    if (shouldUsePublicUrl) {
      return this.getPublicUrl(bucketName, objectName);
    }

    return this.getExternalPresignedUrl(bucketName, objectName, expiry);
  }

  /**
   * 生成外部可访问的预签名URL
   * 解决Docker部署时URL使用容器名而非外部IP的问题
   */
  async getExternalPresignedUrl(
    bucketName: string,
    objectName: string,
    expiry: number = 24 * 60 * 60,
  ): Promise<string> {
    try {
      // 首先获取内部预签名URL
      const internalUrl = await this.minioClient.presignedGetObject(bucketName, objectName, expiry);

      // 如果配置了外部端点，替换URL中的域名和端口
      if (
        this.externalEndpoint &&
        this.externalEndpoint !== this.configService.get<string>('MINIO_ENDPOINT', 'localhost')
      ) {
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
  private async setBucketPublicReadPolicy(bucketName: string): Promise<boolean> {
    try {
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${bucketName}/*`],
          },
        ],
      };

      await this.minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
      this.bucketPublicReadAccess.set(bucketName, true);
      this.logger.log(`Public read policy set for bucket '${bucketName}'`);
      return true;
    } catch (error) {
      this.bucketPublicReadAccess.set(bucketName, false);
      this.logger.warn(
        `Failed to set public policy for bucket '${bucketName}': ${this.getErrorMessage(error)}`,
      );
      return false;
    }
  }

  private async hasBucketPublicReadAccess(bucketName: string): Promise<boolean> {
    const cachedAccess = this.bucketPublicReadAccess.get(bucketName);
    if (cachedAccess !== undefined) {
      return cachedAccess;
    }

    return this.refreshBucketAccessMode(bucketName);
  }

  private async refreshBucketAccessMode(bucketName: string): Promise<boolean> {
    try {
      const bucketPolicy = await this.minioClient.getBucketPolicy(bucketName);
      const hasPublicReadAccess = this.hasAnonymousReadAccess(bucketPolicy, bucketName);
      this.bucketPublicReadAccess.set(bucketName, hasPublicReadAccess);
      return hasPublicReadAccess;
    } catch (error) {
      const errorCode = this.getErrorCode(error);
      this.bucketPublicReadAccess.set(bucketName, false);

      if (!['NoSuchBucketPolicy', 'NoSuchBucket'].includes(errorCode)) {
        this.logger.warn(
          `Failed to inspect bucket policy for '${bucketName}': ${this.getErrorMessage(error)}`,
        );
      }

      return false;
    }
  }

  private hasAnonymousReadAccess(policyDocument: string, bucketName: string): boolean {
    try {
      const policy = JSON.parse(policyDocument) as {
        Statement?: Array<{
          Action?: string | string[];
          Effect?: string;
          Principal?: '*' | { AWS?: string | string[] };
          Resource?: string | string[];
        }>;
      };

      const bucketObjectArn = `arn:aws:s3:::${bucketName}/*`;

      return (policy.Statement || []).some((statement) => {
        const actions = this.normalizeStringArray(statement.Action);
        const resources = this.normalizeStringArray(statement.Resource);

        return (
          statement.Effect === 'Allow' &&
          this.isAnonymousPrincipal(statement.Principal) &&
          actions.some((action) => ['*', 's3:*', 's3:GetObject'].includes(action)) &&
          resources.some((resource) => ['*', bucketObjectArn].includes(resource))
        );
      });
    } catch (error) {
      this.logger.warn(
        `Failed to parse bucket policy for '${bucketName}': ${this.getErrorMessage(error)}`,
      );
      return false;
    }
  }

  private isAnonymousPrincipal(principal: '*' | { AWS?: string | string[] } | undefined): boolean {
    if (principal === '*') {
      return true;
    }

    const awsPrincipal = principal?.AWS;
    return this.normalizeStringArray(awsPrincipal).includes('*');
  }

  private normalizeStringArray(value: string | string[] | undefined): string[] {
    if (Array.isArray(value)) {
      return value;
    }

    if (typeof value === 'string' && value !== '') {
      return [value];
    }

    return [];
  }

  private getBooleanConfig(key: string, defaultValue: boolean): boolean {
    const value = this.configService.get<string | boolean>(key, defaultValue);

    if (typeof value === 'boolean') {
      return value;
    }

    return String(value).trim().toLowerCase() === 'true';
  }

  private getNumberConfig(key: string, defaultValue: number): number {
    const value = this.configService.get<string | number>(key, defaultValue);
    return Number(value);
  }

  private getErrorCode(error: unknown): string {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      typeof error.code === 'string'
    ) {
      return error.code;
    }

    return 'UnknownError';
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof error.message === 'string'
    ) {
      return error.message;
    }

    return String(error);
  }

  getClient(): Minio.Client {
    return this.minioClient;
  }
}
