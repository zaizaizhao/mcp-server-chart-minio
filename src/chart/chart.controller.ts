import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiQuery 
} from '@nestjs/swagger';
import { ChartRenderService, ChartOptions } from './chart-render.service';

@ApiTags('chart')
@Controller('chart')
export class ChartController {
  constructor(private readonly chartRenderService: ChartRenderService) {}

  @Post('render')
  @ApiOperation({ summary: 'Render chart and upload to MinIO' })
  @ApiBody({
    description: 'Chart configuration',
    schema: {
      type: 'object',
      properties: {
        type: { 
          type: 'string', 
          example: 'line',
          description: 'Chart type (line, pie, column, bar, etc.)'
        },
        data: { 
          type: 'array',
          example: [
            { time: '2020', value: 100 },
            { time: '2021', value: 120 },
            { time: '2022', value: 140 }
          ],
          description: 'Chart data'
        },
        title: { 
          type: 'string', 
          example: 'Sample Chart',
          description: 'Chart title (optional)'
        },
        width: { 
          type: 'number', 
          example: 800,
          description: 'Chart width (optional, default: 800)'
        },
        height: { 
          type: 'number', 
          example: 600,
          description: 'Chart height (optional, default: 600)'
        },
        theme: {
          type: 'string',
          enum: ['default', 'academy'],
          example: 'default',
          description: 'Chart theme (optional)'
        }
      },
      required: ['type', 'data']
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Chart rendered successfully',
    schema: {
      type: 'object',
      properties: {
        url: { 
          type: 'string', 
          example: 'http://localhost:9000/charts/chart-uuid.png?X-Amz-...',
          description: 'MinIO URL to access the rendered chart image'
        },
        filename: { 
          type: 'string', 
          example: 'chart-12345678-1234-1234-1234-123456789abc.png',
          description: 'Generated filename in MinIO'
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid chart configuration' })
  @ApiResponse({ status: 500, description: 'Chart rendering failed' })
  async renderChart(@Body() chartOptions: ChartOptions) {
    return await this.chartRenderService.renderChartToUrl(chartOptions);
  }

  @Get('types')
  @ApiOperation({ summary: 'Get supported chart types' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of supported chart types',
    schema: {
      type: 'object',
      properties: {
        types: {
          type: 'array',
          items: { type: 'string' },
          example: ['line', 'pie', 'column', 'bar', 'scatter']
        }
      }
    }
  })
  getSupportedTypes() {
    return {
      types: this.chartRenderService.getSupportedChartTypes()
    };
  }

  @Get('sample')
  @ApiOperation({ summary: 'Generate sample chart' })
  @ApiQuery({ 
    name: 'type', 
    required: false, 
    description: 'Chart type', 
    example: 'line' 
  })
  @ApiQuery({ 
    name: 'theme', 
    required: false, 
    description: 'Chart theme', 
    example: 'default',
    enum: ['default', 'academy']
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Sample chart rendered successfully',
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string' },
        filename: { type: 'string' },
        chartConfig: { type: 'object' }
      }
    }
  })
  async generateSampleChart(
    @Query('type') type: string = 'line',
    @Query('theme') theme: 'default' | 'academy' = 'default'
  ) {
    const sampleData = this.chartRenderService.generateSampleData(type);
    
    const chartOptions: ChartOptions = {
      type,
      data: sampleData,
      title: `Sample ${type.charAt(0).toUpperCase() + type.slice(1)} Chart`,
      theme,
      width: 800,
      height: 600,
    };

    const result = await this.chartRenderService.renderChartToUrl(chartOptions);
    
    return {
      ...result,
      chartConfig: chartOptions,
    };
  }
}
