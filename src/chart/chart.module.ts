import { Module } from '@nestjs/common';
import { ChartController } from './chart.controller';
import { ChartRenderService } from './chart-render.service';
import { MinioModule } from '../minio/minio.module';

@Module({
  imports: [MinioModule],
  controllers: [ChartController],
  providers: [ChartRenderService],
  exports: [ChartRenderService],
})
export class ChartModule {}
