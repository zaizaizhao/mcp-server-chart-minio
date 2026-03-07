import { resolve } from 'path';

const DEFAULT_ENV_FILE = '.env';
const DOCKER_ENV_FILE = '.env.docker';
const PRODUCTION_ENV_FILE = '.env.production';

function parseString(value: unknown, key: string, defaultValue?: string): string {
  if (typeof value === 'string' && value.trim() !== '') {
    return value.trim();
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  }

  throw new Error(`Config validation error: ${key} is required`);
}

function parsePort(value: unknown, key: string, defaultValue: number): number {
  const rawValue =
    value === undefined || value === null || value === '' ? defaultValue : Number(value);

  if (!Number.isInteger(rawValue) || rawValue < 1 || rawValue > 65535) {
    throw new Error(`Config validation error: ${key} must be an integer between 1 and 65535`);
  }

  return rawValue;
}

function parseBoolean(value: unknown, key: string, defaultValue: boolean): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') {
      return true;
    }
    if (normalized === 'false') {
      return false;
    }
  }

  throw new Error(`Config validation error: ${key} must be true or false`);
}

function parseOptionalHttpUrl(value: unknown, key: string): string | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const url = parseString(value, key);

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error(`Config validation error: ${key} must be a valid http(s) URL`);
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    throw new Error(`Config validation error: ${key} must use the http or https protocol`);
  }

  return url;
}

function parseHost(value: unknown, key: string, defaultValue: string): string {
  const host = parseString(value, key, defaultValue);
  if (host.includes('://')) {
    throw new Error(
      `Config validation error: ${key} must be a host or IP address without protocol`,
    );
  }
  return host;
}

export function getEnvFilePaths(): string[] {
  const cwd = process.cwd();
  const explicitEnvFile = process.env.ENV_FILE?.trim();
  const appEnv = process.env.APP_ENV?.trim();
  const nodeEnv = process.env.NODE_ENV?.trim();

  const candidates = explicitEnvFile
    ? [explicitEnvFile, DEFAULT_ENV_FILE]
    : appEnv === 'docker'
      ? [DOCKER_ENV_FILE, DEFAULT_ENV_FILE]
      : appEnv === 'production' || nodeEnv === 'production'
        ? [PRODUCTION_ENV_FILE, DEFAULT_ENV_FILE]
        : [DEFAULT_ENV_FILE];

  return [...new Set(candidates.map((file) => resolve(cwd, file)))];
}

export function validateEnv(config: Record<string, unknown>): Record<string, unknown> {
  const validatedConfig: Record<string, unknown> = {
    ...config,
  };

  const nodeEnv = parseString(config.NODE_ENV, 'NODE_ENV', 'development');
  const port = parsePort(config.PORT, 'PORT', 3000);
  const minioEndpoint = parseHost(config.MINIO_ENDPOINT, 'MINIO_ENDPOINT', 'localhost');
  const minioPort = parsePort(config.MINIO_PORT, 'MINIO_PORT', 9000);

  validatedConfig.APP_ENV = parseString(config.APP_ENV, 'APP_ENV', 'local');
  validatedConfig.NODE_ENV = nodeEnv;
  validatedConfig.HOST = parseHost(config.HOST, 'HOST', '0.0.0.0');
  validatedConfig.PORT = port;
  validatedConfig.PUBLIC_API_URL = parseOptionalHttpUrl(config.PUBLIC_API_URL, 'PUBLIC_API_URL');
  validatedConfig.MINIO_ENDPOINT = minioEndpoint;
  validatedConfig.MINIO_PORT = minioPort;
  validatedConfig.MINIO_USE_SSL = parseBoolean(config.MINIO_USE_SSL, 'MINIO_USE_SSL', false);
  validatedConfig.MINIO_ACCESS_KEY = parseString(
    config.MINIO_ACCESS_KEY,
    'MINIO_ACCESS_KEY',
    'minioadmin',
  );
  validatedConfig.MINIO_SECRET_KEY = parseString(
    config.MINIO_SECRET_KEY,
    'MINIO_SECRET_KEY',
    'minioadmin',
  );
  validatedConfig.MINIO_BUCKET_NAME = parseString(
    config.MINIO_BUCKET_NAME,
    'MINIO_BUCKET_NAME',
    'charts',
  );
  validatedConfig.MINIO_AUTO_CREATE_BUCKET = parseBoolean(
    config.MINIO_AUTO_CREATE_BUCKET,
    'MINIO_AUTO_CREATE_BUCKET',
    true,
  );
  validatedConfig.MINIO_EXTERNAL_ENDPOINT = parseHost(
    config.MINIO_EXTERNAL_ENDPOINT,
    'MINIO_EXTERNAL_ENDPOINT',
    minioEndpoint,
  );
  validatedConfig.MINIO_EXTERNAL_PORT = parsePort(
    config.MINIO_EXTERNAL_PORT,
    'MINIO_EXTERNAL_PORT',
    minioPort,
  );
  validatedConfig.MINIO_ROOT_USER = parseString(
    config.MINIO_ROOT_USER,
    'MINIO_ROOT_USER',
    'minioadmin',
  );
  validatedConfig.MINIO_ROOT_PASSWORD = parseString(
    config.MINIO_ROOT_PASSWORD,
    'MINIO_ROOT_PASSWORD',
    'minioadmin',
  );

  return validatedConfig;
}
