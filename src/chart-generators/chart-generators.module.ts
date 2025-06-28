import { Module } from '@nestjs/common';
import { ChartGeneratorsController } from './chart-generators.controller';
import { ChartModule } from '../chart/chart.module';

@Module({
  imports: [ChartModule],
  controllers: [ChartGeneratorsController],
})
export class ChartGeneratorsModule {}
