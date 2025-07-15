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
    status: 200, 
    description: 'Chart rendered successfully',
    schema: {
      type: 'object',
      properties: {
        success: { 
          type: 'boolean', 
          example: true,
          description: 'Indicates if the operation was successful'
        },
        errorMessage: { 
          type: 'string', 
          example: null,
          description: 'Error message if operation failed, null if successful'
        },
        resultObj: {
          type: 'string',
          example: '![Chart](http://localhost:9000/charts/chart-uuid.png)\n\nChart rendered successfully. Direct URL: http://localhost:9000/charts/chart-uuid.png',
          description: 'Markdown formatted string containing chart image and URL'
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid chart configuration' })
  @ApiResponse({ status: 500, description: 'Chart rendering failed' })
  async renderChart(@Body() chartOptions: ChartOptions) {
    try {
      const result = await this.chartRenderService.renderChartToUrl(chartOptions);
      return {
        success: true,
        errorMessage: null,
        resultObj: `![${chartOptions.title || 'Chart'}](${result.url})

Chart rendered successfully. 
- Direct URL: ${result.url}
- Filename: ${result.filename}
- Type: ${chartOptions.type}
- Rendered at: ${new Date().toISOString()}`
      };
    } catch (error) {
      return {
        success: false,
        errorMessage: error.message || 'Chart rendering failed',
        resultObj: `❌ Chart rendering failed: ${error.message || 'Unknown error'}

**Error Details:**
- Chart Type: ${chartOptions.type}
- Error Time: ${new Date().toISOString()}
- Source: mcp-server-chart`
      };
    }
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
        success: { 
          type: 'boolean', 
          example: true 
        },
        errorMessage: { 
          type: 'string', 
          example: null 
        },
        resultObj: {
          type: 'string',
          example: '![Sample Line Chart](http://localhost:9000/charts/chart-uuid.png)\n\nSample chart generated successfully.',
          description: 'Markdown formatted string containing sample chart'
        }
      }
    }
  })
  async generateSampleChart(
    @Query('type') type: string = 'line',
    @Query('theme') theme: 'default' | 'academy' = 'default'
  ) {
    try {
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
        success: true,
        errorMessage: null,
        resultObj: `![${chartOptions.title}](${result.url})

📊 **Sample ${type} chart generated successfully**

- Chart Type: ${type}
- Direct URL: ${result.url}
- Filename: ${result.filename}
- Theme: ${theme}
- Generated at: ${new Date().toISOString()}`
      };
    } catch (error) {
      return {
        success: false,
        errorMessage: error.message || 'Sample chart generation failed',
        resultObj: `❌ **Sample chart generation failed**

${error.message || 'Unknown error'}

**Error Details:**
- Chart Type: ${type}
- Error Time: ${new Date().toISOString()}
- Source: mcp-server-chart`
      };
    }
  }
}
