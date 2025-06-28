import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MinioModule } from './minio/minio.module';
import { ChartModule } from './chart/chart.module';
import { ChartGeneratorsModule } from './chart-generators/chart-generators.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MinioModule,
    ChartModule,
    ChartGeneratorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
