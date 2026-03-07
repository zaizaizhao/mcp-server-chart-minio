import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MinioModule } from './minio/minio.module';
import { ChartModule } from './chart/chart.module';
import { ChartGeneratorsModule } from './chart-generators/chart-generators.module';
import { getEnvFilePaths, validateEnv } from './config/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: getEnvFilePaths(),
      validate: validateEnv,
    }),
    MinioModule,
    ChartModule,
    ChartGeneratorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
