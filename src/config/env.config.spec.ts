import { getEnvFilePaths, validateEnv } from './env.config';

describe('env.config', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('should prefer an explicit env file when ENV_FILE is provided', () => {
    process.env.ENV_FILE = '.env.production';
    delete process.env.APP_ENV;
    delete process.env.NODE_ENV;

    expect(getEnvFilePaths()).toEqual([
      expect.stringMatching(/\.env\.production$/),
      expect.stringMatching(/\.env$/),
    ]);
  });

  it('should use docker env defaults when APP_ENV is docker', () => {
    delete process.env.ENV_FILE;
    process.env.APP_ENV = 'docker';
    delete process.env.NODE_ENV;

    expect(getEnvFilePaths()).toEqual([
      expect.stringMatching(/\.env\.docker$/),
      expect.stringMatching(/\.env$/),
    ]);
  });

  it('should reject PUBLIC_API_URL values without protocol', () => {
    expect(() =>
      validateEnv({
        PUBLIC_API_URL: '127.0.0.1:3000',
      }),
    ).toThrow('Config validation error: PUBLIC_API_URL must be a valid http(s) URL');
  });

  it('should normalize numeric and boolean MinIO values', () => {
    expect(
      validateEnv({
        MINIO_PORT: '9000',
        MINIO_USE_SSL: 'false',
        MINIO_AUTO_CREATE_BUCKET: 'true',
        MINIO_EXTERNAL_PORT: '9001',
      }),
    ).toEqual(
      expect.objectContaining({
        MINIO_PORT: 9000,
        MINIO_USE_SSL: false,
        MINIO_AUTO_CREATE_BUCKET: true,
        MINIO_EXTERNAL_PORT: 9001,
      }),
    );
  });
});
