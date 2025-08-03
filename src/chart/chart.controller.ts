import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiQuery,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse
} from '@nestjs/swagger';
import { ChartRenderService, ChartOptions } from './chart-render.service';
import { ChartRenderDto } from './dto/chart.dto';
import { 
  ChartRenderResponseDto, 
  SupportedTypesResponseDto 
} from '../common/dto/common.dto';

@ApiTags('chart')
@Controller('chart')
export class ChartController {
  constructor(private readonly chartRenderService: ChartRenderService) {}

  @Post('render')
  @ApiOperation({ summary: 'Render chart and upload to MinIO' })
  @ApiBody({
    description: 'Chart configuration',
    type: ChartRenderDto
  })
  @ApiOkResponse({ 
    description: 'Chart rendered successfully',
    type: ChartRenderResponseDto
  })
  @ApiBadRequestResponse({ description: 'Invalid chart configuration' })
  @ApiInternalServerErrorResponse({ description: 'Chart rendering failed' })
  async renderChart(@Body() chartOptions: ChartRenderDto): Promise<ChartRenderResponseDto> {
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
  @ApiOkResponse({ 
    description: 'List of supported chart types',
    type: SupportedTypesResponseDto
  })
  getSupportedTypes(): SupportedTypesResponseDto {
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
  @ApiOkResponse({ 
    description: 'Sample chart rendered successfully',
    type: ChartRenderResponseDto
  })
  async generateSampleChart(
    @Query('type') type: string = 'line',
    @Query('theme') theme: 'default' | 'academy' = 'default'
  ): Promise<ChartRenderResponseDto> {
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
