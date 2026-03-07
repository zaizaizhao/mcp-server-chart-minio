import { ConfigService } from '@nestjs/config';
import { MinioService } from './minio.service';

const mockMinioClient = {
  listBuckets: jest.fn(),
  bucketExists: jest.fn(),
  makeBucket: jest.fn(),
  removeBucket: jest.fn(),
  listObjects: jest.fn(),
  presignedGetObject: jest.fn(),
  setBucketPolicy: jest.fn(),
  getBucketPolicy: jest.fn(),
};

jest.mock('minio', () => ({
  Client: jest.fn(() => mockMinioClient),
}));

describe('MinioService', () => {
  const configValues: Record<string, string | number | boolean> = {
    MINIO_ENDPOINT: 'minio',
    MINIO_PORT: 9000,
    MINIO_USE_SSL: false,
    MINIO_ACCESS_KEY: 'access-key',
    MINIO_SECRET_KEY: 'secret-key',
    MINIO_EXTERNAL_ENDPOINT: 'public.example.com',
    MINIO_EXTERNAL_PORT: 9000,
  };

  const configService = {
    get: jest.fn((key: string, defaultValue?: unknown) =>
      key in configValues ? configValues[key] : defaultValue,
    ),
  } as unknown as ConfigService;

  beforeEach(() => {
    Object.values(mockMinioClient).forEach((mockFn) => mockFn.mockReset());
    (configService.get as jest.Mock).mockClear();
  });

  it('should return a public URL when the bucket policy allows anonymous reads', async () => {
    mockMinioClient.getBucketPolicy.mockResolvedValue(
      JSON.stringify({
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: ['arn:aws:s3:::charts/*'],
          },
        ],
      }),
    );

    const service = new MinioService(configService);

    await expect(service.getObjectAccessUrl('charts', 'chart.png')).resolves.toBe(
      'http://public.example.com:9000/charts/chart.png',
    );
    expect(mockMinioClient.presignedGetObject).not.toHaveBeenCalled();
  });

  it('should fall back to an external presigned URL when public policy lookup fails', async () => {
    mockMinioClient.getBucketPolicy.mockRejectedValue({
      code: 'AccessDenied',
      message: 'Access denied',
    });
    mockMinioClient.presignedGetObject.mockResolvedValue(
      'http://minio:9000/charts/chart.png?X-Amz-Algorithm=AWS4-HMAC-SHA256',
    );

    const service = new MinioService(configService);

    await expect(service.getObjectAccessUrl('charts', 'chart.png', 60)).resolves.toBe(
      'http://public.example.com:9000/charts/chart.png?X-Amz-Algorithm=AWS4-HMAC-SHA256',
    );
  });

  it('should create a bucket and keep presigned URL mode when public policy setup fails', async () => {
    mockMinioClient.bucketExists.mockResolvedValue(false);
    mockMinioClient.makeBucket.mockResolvedValue(undefined);
    mockMinioClient.setBucketPolicy.mockRejectedValue(new Error('policy denied'));

    const service = new MinioService(configService);

    await expect(
      service.ensureBucket('charts', {
        applyPublicReadPolicy: true,
      }),
    ).resolves.toBe(false);
    expect(mockMinioClient.makeBucket).toHaveBeenCalledWith('charts', 'us-east-1');
  });
});
