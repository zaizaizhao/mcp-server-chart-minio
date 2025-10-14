import { Body, Controller, Post } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiOkResponse, ApiBadRequestResponse, ApiInternalServerErrorResponse, 
  ApiBody 
} from '@nestjs/swagger';
import { ChartRenderService } from '../chart/chart-render.service';
import {
  AreaChartDto,
  BarChartDto,
  PieChartDto,
  LineChartDto,
  ScatterChartDto,
  HistogramChartDto,
  BoxplotChartDto,
  RadarChartDto,
  TreemapChartDto,
  WordCloudChartDto,
  BaseChartDto,
  ChartResponseDto,
  ColumnChartDto,
  DistrictMapDto,
  DualAxesDto,
  FishboneDiagramDto,
  FlowDiagramDto,
  FunnelChartDto,
  LiquidChartDto,
  MindMapDto,
  NetworkGraphDto,
  OrganizationChartDto,
  PathMapDto,
  PinMapDto,
  SankeyChartDto,
  VennChartDto,
  ViolinChartDto
} from './dto/chart-generators.dto';

@ApiTags('Chart Generators')
@Controller('chart-generators')
export class ChartGeneratorsController {
  constructor(private readonly chartRenderService: ChartRenderService) {}

  @Post('area')
  @ApiOperation({
    summary: 'Generate Area Chart',
    description: 'Creates an area chart visualization with time series data. Area charts are ideal for showing trends over time and emphasizing the magnitude of change.',
    operationId: 'generateAreaChart'
  })
  @ApiBody({
    description: 'Area chart configuration and data',
    type: AreaChartDto,
    examples: {
      'monthly-sales': {
        summary: 'Monthly Sales Data',
        description: 'Example of monthly sales area chart',
        value: {
          title: 'Monthly Sales Trend',
          width: 800,
          height: 600,
          theme: 'default',
          axisXTitle: 'Time',
          axisYTitle: 'Value',
          data: [
            { time: '2023-01', value: 12500 },
            { time: '2023-02', value: 15200 },
            { time: '2023-03', value: 18700 },
            { time: '2023-04', value: 16300 },
            { time: '2023-05', value: 21800 },
            { time: '2023-06', value: 19400 }
          ]
        }
      }
    }
  })
  @ApiOkResponse({ description: 'Area chart generated successfully', type: ChartResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid chart data or configuration provided' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error during chart generation' })
  async generateAreaChart(@Body() body: AreaChartDto): Promise<ChartResponseDto> {
    return this.chartRenderService.renderChartToUrl({ type: 'area', ...body });
  }

  @Post('bar')
  @ApiOperation({
    summary: 'Generate Bar Chart',
    description: 'Creates a horizontal bar chart for comparing different categories. Bar charts are perfect for displaying categorical data with clear comparisons.',
    operationId: 'generateBarChart'
  })
  @ApiBody({
    description: 'Bar chart configuration and data',
    type: BarChartDto,
    examples: {
      'product-comparison': {
        summary: 'Product Sales Comparison',
        description: 'Comparing sales across different products',
        value: {
          title: 'Product Sales Comparison',
          width: 800,
          height: 600,
          theme: 'default',
          axisXTitle: 'Product',
          axisYTitle: 'Value',
          data: [
            { category: 'Product A', value: 32000 },
            { category: 'Product B', value: 45000 },
            { category: 'Product C', value: 28000 },
            { category: 'Product D', value: 52000 }
          ]
        }
      }
    }
  })
  @ApiOkResponse({ description: 'Bar chart generated successfully', type: ChartResponseDto
   })
  @ApiBadRequestResponse({ description: 'Invalid chart data or configuration provided' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error during chart generation' })
  async generateBarChart(@Body() body: BarChartDto): Promise<ChartResponseDto> {
    return this.chartRenderService.renderChartToUrl({ type: 'bar', ...body });
  }

  @Post('boxplot')
  @ApiOperation({
    summary: 'Generate Box Plot Chart',
    description: 'Creates a box plot (box-and-whisker plot) to display statistical distribution of data. Shows median, quartiles, and outliers.',
    operationId: 'generateBoxplotChart'
  })
  @ApiBody({
    description: 'Box plot chart configuration and statistical data',
    type: BoxplotChartDto,
    examples: {
      'statistical-analysis': {
        summary: 'Statistical Data Analysis',
        description: 'Box plot showing distribution across different groups',
        value: {
          title: 'Score Distribution by Group',
          width: 800,
          height: 600,
          theme: 'default',
          axisXTitle: 'Product',
          axisYTitle: 'Value',
          data: [
            { category: 'Group A', value: 45, group: 'A' },
            { category: 'Group B', value: 50, group: 'B' },
            { category: 'Group C', value: 40, group: 'C' }
          ]
        }
      }
    }
  })
  @ApiOkResponse({ description: 'Box plot chart generated successfully', type: ChartResponseDto
   })
  @ApiBadRequestResponse({ description: 'Invalid statistical data provided' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error during chart generation' })
  async generateBoxplotChart(@Body() body: BoxplotChartDto): Promise<ChartResponseDto> {
    return this.chartRenderService.renderChartToUrl({ type: 'boxplot', ...body });
  }

  @Post('column')
  @ApiOperation({
    summary: 'Generate Column Chart',
    description: 'Creates a vertical column chart for displaying categorical data. Column charts are excellent for comparing values across categories.',
    operationId: 'generateColumnChart'
  })
  @ApiBody({
    description: 'Column chart configuration and data',
    type: ColumnChartDto,
    examples: {
      'quarterly-revenue': {
        summary: 'Quarterly Revenue',
        description: 'Column chart showing quarterly revenue data',
        value: {
          title: 'Quarterly Revenue 2023',
          axisXTitle: 'Quarter',
          axisYTitle: 'Revenue (in thousands)',
          width: 800,
          height: 600,
          theme: 'default',
          data: [
            { category: 'Q1', value: 125000 },
            { category: 'Q2', value: 148000 },
            { category: 'Q3', value: 162000 },
            { category: 'Q4', value: 185000 }
          ]
        }
      }
    }
  })
  @ApiOkResponse({ description: 'Column chart generated successfully', type: ChartResponseDto
   })
  @ApiBadRequestResponse({ description: 'Invalid chart data or configuration provided' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error during chart generation' })
  async generateColumnChart(@Body() body: ColumnChartDto): Promise<ChartResponseDto> {
    return this.chartRenderService.renderChartToUrl({ type: 'column', ...body });
  }

  @Post('district-map')
  @ApiOperation({
    summary: 'Generate District Map Chart',
    description: 'Creates a geographic district map visualization showing data distribution across different administrative regions.',
    operationId: 'generateDistrictMap'
  })
  @ApiBody({
    description: 'District map configuration and geographic data',
    type: DistrictMapDto,
    examples: {
      'population-distribution': {
        summary: 'Population Distribution',
        description: 'District map showing population distribution across cities',
        value: {
          title: 'Population Distribution by District',
          width: 900,
          height: 700,
          theme: 'default',
          data: [
            { district: 'Beijing', value: 21540000 },
            { district: 'Shanghai', value: 24280000 },
            { district: 'Guangzhou', value: 15300000 },
            { district: 'Shenzhen', value: 13440000 },
            { district: 'Chengdu', value: 20940000 }
          ]
        }
      }
    }
  })
  @ApiOkResponse({ description: 'District map generated successfully', type: ChartResponseDto
   })
  @ApiBadRequestResponse({ description: 'Invalid geographic data provided' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error during chart generation' })
  async generateDistrictMap(@Body() body: DistrictMapDto): Promise<ChartResponseDto> {
    return this.chartRenderService.renderChartToUrl({ type: 'district-map', ...body });
  }

  @Post('dual-axes')
  @ApiOperation({
    summary: 'Generate Dual Axes Chart',
    description: 'Creates a chart with two different Y-axes, perfect for displaying two related data series with different scales or units.',
    operationId: 'generateDualAxesChart'
  })
  @ApiBody({
    description: 'Dual axes chart configuration with two value series',
    type: DualAxesDto,
    examples: {
      'sales-and-profit': {
        summary: 'Sales and Profit Analysis',
        description: 'Dual axes chart showing sales volume and profit margin',
        value: {
          title: 'Sales Volume vs Profit Margin',
          width: 800,
          height: 600,
          theme: 'default',
          data: [
            { time: '2023-01', sales: 125000, profit: 8.5 },
            { time: '2023-02', sales: 148000, profit: 9.2 },
            { time: '2023-03', sales: 162000, profit: 7.8 },
            { time: '2023-04', sales: 185000, profit: 10.1 }
          ]
        }
      }
    }
  })
  @ApiOkResponse({ description: 'Dual axes chart generated successfully', type: ChartResponseDto
   })
  @ApiBadRequestResponse({ description: 'Invalid dual axes data provided' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error during chart generation' })
  async generateDualAxesChart(@Body() body: DualAxesDto): Promise<ChartResponseDto> {
    return this.chartRenderService.renderChartToUrl({ type: 'dual-axes', ...body });
  }

  @Post('fishbone-diagram')
  @ApiOperation({
    summary: 'Generate Fishbone Diagram',
    description: 'Creates a fishbone (Ishikawa) diagram for root cause analysis, showing cause-and-effect relationships.',
    operationId: 'generateFishboneDiagram'
  })
  @ApiBody({
    description: 'Fishbone diagram configuration with causes and categories',
    type: FishboneDiagramDto,
    examples: {
      'quality-issues': {
        summary: 'Quality Issue Analysis',
        description: 'Fishbone diagram for analyzing product quality issues',
        value: {
          title: 'Product Quality Issue Analysis',
          width: 1000,
          height: 700,
          theme: 'default',
          data: [
            { category: 'People', cause: 'Insufficient training' },
            { category: 'People', cause: 'Lack of experience' },
            { category: 'Process', cause: 'Unclear procedures' },
            { category: 'Process', cause: 'Inefficient workflow' },
            { category: 'Equipment', cause: 'Outdated machinery' },
            { category: 'Equipment', cause: 'Poor maintenance' },
            { category: 'Materials', cause: 'Low quality inputs' },
            { category: 'Environment', cause: 'Temperature fluctuations' }
          ]
        }
      }
    }
  })
  @ApiOkResponse({ description: 'Fishbone diagram generated successfully', type: ChartResponseDto
   })
  @ApiBadRequestResponse({ description: 'Invalid fishbone diagram data provided' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error during chart generation' })
  async generateFishboneDiagram(@Body() body: FishboneDiagramDto): Promise<ChartResponseDto> {
    return this.chartRenderService.renderChartToUrl({ type: 'fishbone-diagram', ...body });
  }

  @Post('flow-diagram')
  @ApiOperation({
    summary: 'Generate Flow Diagram',
    description: 'Creates a flowchart diagram to visualize processes, workflows, or decision trees with nodes and connections.',
    operationId: 'generateFlowDiagram'
  })
  @ApiBody({
    description: 'Flow diagram configuration with nodes and edges',
    type: FlowDiagramDto,
    examples: {
      'business-process': {
        summary: 'Business Process Flow',
        description: 'Flowchart showing a typical business approval process',
        value: {
          title: 'Order Approval Process',
          width: 900,
          height: 700,
          theme: 'default',
          data: [
            { id: '1', label: 'Start', type: 'start' },
            { id: '2', label: 'Receive Order', type: 'process' },
            { id: '3', label: 'Check Inventory', type: 'process' },
            { id: '4', label: 'In Stock?', type: 'decision' },
            { id: '5', label: 'Process Order', type: 'process' },
            { id: '6', label: 'Backorder', type: 'process' },
            { id: '7', label: 'End', type: 'end' },
            { from: '1', to: '2' },
            { from: '2', to: '3' },
            { from: '3', to: '4' },
            { from: '4', to: '5', label: 'Yes' },
            { from: '4', to: '6', label: 'No' },
            { from: '5', to: '7' },
            { from: '6', to: '7' }
          ]
        }
      }
    }
  })
  @ApiOkResponse({ description: 'Flow diagram generated successfully', type: ChartResponseDto
   })
  @ApiBadRequestResponse({ description: 'Invalid flow diagram structure provided' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error during chart generation' })
  async generateFlowDiagram(@Body() body: FlowDiagramDto): Promise<ChartResponseDto> {
    return this.chartRenderService.renderChartToUrl({ type: 'flow-diagram', ...body });
  }

  @Post('funnel')
  @ApiOperation({
    summary: 'Generate Funnel Chart',
    description: 'Creates a funnel chart to visualize stages in a process and conversion rates, commonly used for sales pipelines.',
    operationId: 'generateFunnelChart'
  })
  @ApiBody({
    description: 'Funnel chart configuration with stages and values',
    type: FunnelChartDto,
    examples: {
      'sales-funnel': {
        summary: 'Sales Conversion Funnel',
        description: 'Funnel showing customer conversion through sales stages',
        value: {
          title: 'Sales Conversion Funnel',
          width: 800,
          height: 600,
          theme: 'default',
          data: [
            { category: 'Website Visitors', value: 10000 },
            { category: 'Product Views', value: 5000 },
            { category: 'Add to Cart', value: 1500 },
            { category: 'Checkout Started', value: 800 },
            { category: 'Purchase Completed', value: 500 }
          ]
        }
      }
    }
  })
  @ApiOkResponse({ description: 'Funnel chart generated successfully', type: ChartResponseDto
   })
  @ApiBadRequestResponse({ description: 'Invalid funnel data provided' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error during chart generation' })
  async generateFunnelChart(@Body() body: FunnelChartDto): Promise<ChartResponseDto> {
    return this.chartRenderService.renderChartToUrl({ type: 'funnel', ...body });
  }

  @Post('histogram')
  @ApiOperation({
    summary: 'Generate Histogram Chart',
    description: 'Creates a histogram to display the distribution of numerical data across different bins or intervals.',
    operationId: 'generateHistogramChart'
  })
  @ApiBody({
    description: 'Histogram chart configuration with bins and frequencies',
    type: HistogramChartDto,
    examples: {
      'age-distribution': {
        summary: 'Age Distribution',
        description: 'Histogram showing age distribution in a population',
        value: {
          title: 'Population Age Distribution',
          width: 800,
          height: 600,
          theme: 'default',
          data: [1.2, 3.4, 3.7, 4.3, 5.2, 5.8, 6.1, 6.5, 6.8, 7.1, 7.3, 7.7, 8.3, 8.6, 8.8, 9.1, 9.2, 9.4, 9.5,9.7, 10.5, 10.7, 10.8, 11, 11, 11.1, 11.2, 11.3, 11.4, 11.4, 11.7, 12, 12.9, 12.9, 13.3, 13.7,13.8, 13.9, 14, 14.2, 14.5, 15, 15.2, 15.6, 16, 16.3, 17.3, 17.5, 17.9, 18, 18, 20.6, 21, 23.4],
          axisXTitle: 'Range',
          axisYTitle: 'Count'
        }
      }
    }
  })
  @ApiOkResponse({ description: 'Histogram chart generated successfully', type: ChartResponseDto
   })
  @ApiBadRequestResponse({ description: 'Invalid histogram data provided' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error during chart generation' })
  async generateHistogramChart(@Body() body: HistogramChartDto): Promise<ChartResponseDto> {
    return this.chartRenderService.renderChartToUrl({ type: 'histogram', ...body });
  }

  @Post('line')
  @ApiOperation({
    summary: 'Generate Line Chart',
    description: 'Creates a line chart to show trends and changes over time, perfect for time series data visualization.',
    operationId: 'generateLineChart'
  })
  @ApiBody({
    description: 'Line chart configuration with x and y coordinates',
    type: LineChartDto,
    examples: {
      'stock-price': {
        summary: 'Stock Price Trend',
        description: 'Line chart showing stock price movement over time',
        value: {
          title: 'Stock Price Trend',
          width: 800,
          height: 600,
          theme: 'default',
          data: [
            { time: 2018, value: 91.9 },
            { time: 2019, value: 99.1 },
            { time: 2020, value: 101.6 },
            { time: 2021, value: 114.4 },
            { time: 2022, value: 121 }
          ],
          axisXTitle: 'Year',
          axisYTitle: 'Growth'
        }
      }
    }
  })
  @ApiOkResponse({ description: 'Line chart generated successfully', type: ChartResponseDto
   })
  @ApiBadRequestResponse({ description: 'Invalid line chart data provided' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error during chart generation' })
  async generateLineChart(@Body() body: LineChartDto): Promise<ChartResponseDto> {
    return this.chartRenderService.renderChartToUrl({ type: 'line', ...body });
  }

  @Post('liquid')
  @ApiOperation({
    summary: 'Generate Liquid Chart',
    description: 'Creates a liquid fill gauge chart to display percentage or progress values in an engaging visual format.',
    operationId: 'generateLiquidChart'
  })
  @ApiBody({
    description: 'Liquid chart configuration with percentage value',
    type: LiquidChartDto,
    examples: {
      'completion-rate': {
        summary: 'Project Completion Rate',
        description: 'Liquid chart showing project completion percentage',
        value: {
          title: 'Project Completion Rate',
          width: 400,
          height: 400,
          theme: 'default',
          percent: 0.73,
          shape: 'circle' //["circle", "rect", "pin", "triangle"]
        }
      }
    }
  })
  @ApiOkResponse({ description: 'Liquid chart generated successfully', type: ChartResponseDto
   })
  @ApiBadRequestResponse({ description: 'Invalid liquid chart data provided' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error during chart generation' })
  async generateLiquidChart(@Body() body: LiquidChartDto): Promise<ChartResponseDto> {
    return this.chartRenderService.renderChartToUrl({ type: 'liquid', ...body });
  }

  @Post('mind-map')
  @ApiOperation({
    summary: 'Generate Mind Map',
    description: 'Creates a mind map visualization to show hierarchical relationships and brainstorming ideas around a central topic.',
    operationId: 'generateMindMap'
  })
  @ApiBody({
    description: 'Mind map configuration with hierarchical node structure',
    type: MindMapDto,
    examples: {
      'project-planning': {
        summary: 'Project Planning Mind Map',
        description: 'Mind map for software project planning',
        value: {
          title: 'Software Project Planning',
          width: 1000,
          height: 800,
          theme: 'default',
          data: {
            name: 'Software Project',
            children: [
              { name: 'Planning' },
              { name: 'Development', children: [{ name: 'Java' }, { name: 'JavaScript' }, { name: 'Python' }] },
              { name: 'Testing' },
              { name: 'Deployment' },
              { name: 'Requirements' },
            ]
          }
        }
      }
    }
  })
  @ApiOkResponse({ description: 'Mind map generated successfully', type: ChartResponseDto
   })
  @ApiBadRequestResponse({ description: 'Invalid mind map structure provided' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error during chart generation' })
  async generateMindMap(@Body() body: MindMapDto): Promise<ChartResponseDto> {
    return this.chartRenderService.renderChartToUrl({ type: 'mind-map', ...body });
  }

  @Post('network-graph')
  @ApiOperation({
    summary: 'Generate Network Graph',
    description: 'Creates a network graph visualization to show relationships and connections between different entities or nodes.',
    operationId: 'generateNetworkGraph'
  })
  @ApiBody({
    description: 'Network graph configuration with nodes and edges',
    type: NetworkGraphDto,
    examples: {
      'social-network': {
        summary: 'Social Network Connections',
        description: 'Network graph showing social connections between users',
        value: {
          title: 'Social Network Analysis',
          width: 900,
          height: 700,
          theme: 'default',
          data: [
            { id: 'A', label: 'Alice' },
            { id: 'B', label: 'Bob' },
            { id: 'C', label: 'Charlie' },
            { id: 'D', label: 'Diana' },
            { id: 'E', label: 'Eve' },
            { source: 'A', target: 'B' },
            { source: 'A', target: 'C' },
            { source: 'B', target: 'D' },
            { source: 'C', target: 'D' },
            { source: 'D', target: 'E' }
          ]
        }
      }
    }
  })
  @ApiOkResponse({ description: 'Network graph generated successfully', type: ChartResponseDto
   })
  @ApiBadRequestResponse({ description: 'Invalid network graph data provided' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error during chart generation' })
  async generateNetworkGraph(@Body() body: NetworkGraphDto): Promise<ChartResponseDto> {
    return this.chartRenderService.renderChartToUrl({ type: 'network-graph', ...body });
  }

  @Post('organization-chart')
  @ApiOperation({
    summary: 'Generate Organization Chart',
    description: 'Creates an organizational hierarchy chart to visualize company structure and reporting relationships.',
    operationId: 'generateOrganizationChart'
  })
  @ApiBody({
    description: 'Organization chart configuration with employee hierarchy',
    type: OrganizationChartDto,
    examples: {
      'company-structure': {
        summary: 'Company Organizational Structure',
        description: 'Organization chart showing company hierarchy',
        value: {
          title: 'Company Organizational Structure',
          width: 1000,
          height: 800,
          theme: 'default',
          data: [
            { id: '1', name: 'John Smith', title: 'CEO', parent: null },
            { id: '2', name: 'Sarah Johnson', title: 'CTO', parent: '1' },
            { id: '3', name: 'Mike Davis', title: 'CFO', parent: '1' },
            { id: '4', name: 'Lisa Chen', title: 'VP Engineering', parent: '2' },
            { id: '5', name: 'Tom Wilson', title: 'VP Product', parent: '2' },
            { id: '6', name: 'Anna Brown', title: 'Senior Developer', parent: '4' },
            { id: '7', name: 'David Lee', title: 'Product Manager', parent: '5' }
          ]
        }
      }
    }
  })
  @ApiOkResponse({ description: 'Organization chart generated successfully', type: ChartResponseDto
   })
  @ApiBadRequestResponse({ description: 'Invalid organization chart data provided' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error during chart generation' })
  async generateOrganizationChart(@Body() body: OrganizationChartDto): Promise<ChartResponseDto> {
    return this.chartRenderService.renderChartToUrl({ type: 'organization-chart', ...body });
  }

  @Post('path-map')
  @ApiOperation({
    summary: 'Generate Path Map Chart',
    description: 'Creates a path map visualization showing routes and connections between geographic locations with flow values.',
    operationId: 'generatePathMap'
  })
  @ApiBody({
    description: 'Path map configuration with geographic routes and flow data',
    type: PathMapDto,
    examples: {
      'shipping-routes': {
        summary: 'Shipping Routes Analysis',
        description: 'Path map showing shipping routes and cargo volumes',
        value: {
          title: 'Global Shipping Routes',
          width: 1000,
          height: 600,
          theme: 'default',
          data: [{ "data": ["西安钟楼", "西安大唐不夜城", "西安大雁塔"] }, { "data": ["西安曲江池公园", "西安回民街"] }]
        }
      }
    }
  })
  @ApiOkResponse({ description: 'Path map generated successfully', type: ChartResponseDto
   })
  @ApiBadRequestResponse({ description: 'Invalid path map data provided' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error during chart generation' })
  async generatePathMap(@Body() body: PathMapDto): Promise<ChartResponseDto> {
    return this.chartRenderService.renderChartToUrl({ type: 'path-map', ...body });
  }

  @Post('pie')
  @ApiOperation({
    summary: 'Generate Pie Chart',
    description: 'Creates a pie chart to display proportional data and show parts of a whole, ideal for showing percentages and distributions.',
    operationId: 'generatePieChart'
  })
  @ApiBody({
    description: 'Pie chart configuration with categories and values',
    type: PieChartDto,
    examples: {
      'market-share': {
        summary: 'Market Share Distribution',
        description: 'Pie chart showing market share across different companies',
        value: {
          title: 'Market Share by Company',
          width: 600,
          height: 600,
          theme: 'default',
          data: [
            { category: 'Company A', value: 35.5 },
            { category: 'Company B', value: 28.2 },
            { category: 'Company C', value: 18.7 },
            { category: 'Company D', value: 12.1 },
            { category: 'Others', value: 5.5 }
          ]
        }
      }
    }
  })
  @ApiOkResponse({ description: 'Pie chart generated successfully', type: ChartResponseDto
   })
  @ApiBadRequestResponse({ description: 'Invalid pie chart data provided' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error during chart generation' })
  async generatePieChart(@Body() body: PieChartDto): Promise<ChartResponseDto> {
    return this.chartRenderService.renderChartToUrl({ type: 'pie', ...body });
  }

  @Post('pin-map')
  @ApiOperation({
    summary: 'Generate Pin Map Chart',
    description: 'Creates a pin map visualization showing specific locations with values on a geographic map using coordinates.',
    operationId: 'generatePinMap'
  })
  @ApiBody({
    description: 'Pin map configuration with geographic coordinates and location data',
    type: PinMapDto,
    examples: {
      'store-locations': {
        summary: 'Store Locations and Sales',
        description: 'Pin map showing store locations with sales data',
        value: {
          title: 'Store Locations and Performance',
          width: 900,
          height: 700,
          theme: 'default',
          data: [
            { lat: 39.9042, lng: 116.4074, name: 'Beijing Store', value: 85000 },
            { lat: 31.2304, lng: 121.4737, name: 'Shanghai Store', value: 120000 },
            { lat: 23.1291, lng: 113.2644, name: 'Guangzhou Store', value: 95000 },
            { lat: 22.3193, lng: 114.1694, name: 'Hong Kong Store', value: 110000 },
            { lat: 30.5728, lng: 104.0668, name: 'Chengdu Store', value: 75000 }
          ]
        }
      }
    }
  })
  @ApiOkResponse({ description: 'Pin map generated successfully', type: ChartResponseDto
   })
  @ApiBadRequestResponse({ description: 'Invalid pin map coordinates provided' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error during chart generation' })
  async generatePinMap(@Body() body: PinMapDto): Promise<ChartResponseDto> {
    return this.chartRenderService.renderChartToUrl({ type: 'pin-map', ...body });
  }

  @Post('radar')
  @ApiOperation({
    summary: 'Generate Radar Chart',
    description: 'Creates a radar (spider) chart to display multivariate data across multiple dimensions, perfect for comparing profiles.',
    operationId: 'generateRadarChart'
  })
  @ApiBody({
    description: 'Radar chart configuration with multiple dimensions and values',
    type: RadarChartDto,
    examples: {
      'skill-assessment': {
        summary: 'Employee Skill Assessment',
        description: 'Radar chart showing employee skills across different dimensions',
        value: {
          title: 'Employee Skill Assessment',
          width: 600,
          height: 600,
          theme: 'default',
          data: [
            { name: 'Technical Skills', value: 85 },
            { name: 'Communication', value: 78 },
            { name: 'Leadership', value: 72 },
            { name: 'Problem Solving', value: 90 },
            { name: 'Creativity', value: 68 },
            { name: 'Team Work', value: 82 }
          ]
        }
      }
    }
  })
  @ApiOkResponse({ description: 'Radar chart generated successfully', type: ChartResponseDto
   })
  @ApiBadRequestResponse({ description: 'Invalid radar chart data provided' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error during chart generation' })
  async generateRadarChart(@Body() body: RadarChartDto): Promise<ChartResponseDto> {
    return this.chartRenderService.renderChartToUrl({ type: 'radar', ...body });
  }

  @Post('sankey')
  @ApiOperation({
    summary: 'Generate Sankey Chart',
    description: 'Creates a Sankey diagram to visualize flow and transfer of resources, energy, or data between different stages or categories.',
    operationId: 'generateSankeyChart'
  })
  @ApiBody({
    description: 'Sankey chart configuration with flow data between nodes',
    type: SankeyChartDto,
    examples: {
      'energy-flow': {
        summary: 'Energy Flow Analysis',
        description: 'Sankey diagram showing energy distribution in a system',
        value: {
          title: 'Energy Distribution System',
          width: 900,
          height: 600,
          theme: 'default',
          data: [
            { source: 'Coal', target: 'Electricity', value: 45 },
            { source: 'Natural Gas', target: 'Electricity', value: 25 },
            { source: 'Nuclear', target: 'Electricity', value: 15 },
            { source: 'Renewable', target: 'Electricity', value: 15 },
            { source: 'Electricity', target: 'Residential', value: 35 },
            { source: 'Electricity', target: 'Commercial', value: 25 },
            { source: 'Electricity', target: 'Industrial', value: 40 }
          ]
        }
      }
    }
  })
  @ApiOkResponse({ description: 'Sankey chart generated successfully', type: ChartResponseDto
   })
  @ApiBadRequestResponse({ description: 'Invalid Sankey flow data provided' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error during chart generation' })
  async generateSankeyChart(@Body() body: SankeyChartDto): Promise<ChartResponseDto> {
    return this.chartRenderService.renderChartToUrl({ type: 'sankey', ...body });
  }

  @Post('scatter')
  @ApiOperation({
    summary: 'Generate Scatter Plot Chart',
    description: 'Creates a scatter plot to show the relationship between two numerical variables and identify correlations or patterns.',
    operationId: 'generateScatterChart'
  })
  @ApiBody({
    description: 'Scatter plot configuration with x and y coordinate data',
    type: ScatterChartDto,
    examples: {
      'height-weight-correlation': {
        summary: 'Height vs Weight Correlation',
        description: 'Scatter plot showing correlation between height and weight',
        value: {
          title: 'Height vs Weight Correlation Analysis',
          width: 800,
          height: 600,
          theme: 'default',
          data: [
            { x: 22, y: 3000 },
            { x: 23, y: 3200 },
            { x: 24, y: 3100 },
            { x: 25, y: 3500 },
            { x: 26, y: 3300 },
            { x: 27, y: 3600 },
            { x: 28, y: 4000 },
            { x: 29, y: 3900 },
            { x: 30, y: 4200 },
            { x: 31, y: 4100 },
            { x: 32, y: 4500 },
            { x: 33, y: 4700 }
          ],
          axisXTitle: 'age',
          axisYTitle: 'income'
        }
      }
    }
  })
  @ApiOkResponse({ description: 'Scatter plot generated successfully', type: ChartResponseDto
   })
  @ApiBadRequestResponse({ description: 'Invalid scatter plot data provided' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error during chart generation' })
  async generateScatterChart(@Body() body: ScatterChartDto): Promise<ChartResponseDto> {
    return this.chartRenderService.renderChartToUrl({ type: 'scatter', ...body });
  }

  @Post('treemap')
  @ApiOperation({
    summary: 'Generate Treemap Chart',
    description: 'Creates a treemap visualization to display hierarchical data using nested rectangles, with size representing values.',
    operationId: 'generateTreemapChart'
  })
  @ApiBody({
    description: 'Treemap chart configuration with hierarchical data structure',
    type: TreemapChartDto,
    examples: {
      'budget-allocation': {
        summary: 'Budget Allocation Treemap',
        description: 'Treemap showing budget allocation across departments',
        value: {
          title: 'Company Budget Allocation',
          width: 800,
          height: 600,
          theme: 'default',
          data: [
            { name: 'Company', parent: '', value: 1000000 },
            { name: 'Engineering', parent: 'Company', value: 400000 },
            { name: 'Marketing', parent: 'Company', value: 250000 },
            { name: 'Sales', parent: 'Company', value: 200000 },
            { name: 'Operations', parent: 'Company', value: 150000 },
            { name: 'Frontend Dev', parent: 'Engineering', value: 180000 },
            { name: 'Backend Dev', parent: 'Engineering', value: 220000 },
            { name: 'Digital Marketing', parent: 'Marketing', value: 150000 },
            { name: 'Content Marketing', parent: 'Marketing', value: 100000 }
          ]
        }
      }
    }
  })
  @ApiOkResponse({ description: 'Treemap chart generated successfully', type: ChartResponseDto
   })
  @ApiBadRequestResponse({ description: 'Invalid treemap hierarchical data provided' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error during chart generation' })
  async generateTreemapChart(@Body() body: TreemapChartDto): Promise<ChartResponseDto> {
    return this.chartRenderService.renderChartToUrl({ type: 'treemap', ...body });
  }

  @Post('venn')
  @ApiOperation({
    summary: 'Generate Venn Diagram',
    description: 'Creates a Venn diagram to visualize set relationships, intersections, and overlaps between different groups or categories.',
    operationId: 'generateVennChart'
  })
  @ApiBody({
    description: 'Venn diagram configuration with sets and intersection data',
    type: VennChartDto,
    examples: {
      'skill-overlap': {
        summary: 'Employee Skill Overlap',
        description: 'Venn diagram showing skill overlap between different teams',
        value: {
          title: 'Team Skill Overlap Analysis',
          width: 600,
          height: 600,
          theme: 'default',
          data: [
            { label: 'A', value: 10, sets: ['A'] }, 
            { label: 'B', value: 20, sets: ['B'] }, 
            { label: 'C', value: 30, sets: ['C'] }, 
            { label: 'AB', value: 5, sets: ['A', 'B'] }
          ]
        }
      }
    }
  })
  @ApiOkResponse({ description: 'Venn diagram generated successfully', type: ChartResponseDto
   })
  @ApiBadRequestResponse({ description: 'Invalid Venn diagram set data provided' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error during chart generation' })
  async generateVennChart(@Body() body: VennChartDto): Promise<ChartResponseDto> {
    return this.chartRenderService.renderChartToUrl({ type: 'venn', ...body });
  }

  @Post('violin')
  @ApiOperation({
    summary: 'Generate Violin Plot Chart',
    description: 'Creates a violin plot to show the distribution shape of data across different categories, combining aspects of box plots and density plots.',
    operationId: 'generateViolinChart'
  })
  @ApiBody({
    description: 'Violin plot configuration with distribution data',
    type: ViolinChartDto,
    examples: {
      'performance-distribution': {
        summary: 'Performance Score Distribution',
        description: 'Violin plot showing performance score distribution across teams',
        value: {
          title: 'Team Performance Score Distribution',
          width: 800,
          height: 600,
          theme: 'default',
          data: [
            { 
              category: 'Team A', 
              values: [85, 87, 89, 92, 88, 91, 86, 90, 87, 93, 89, 88, 91, 87, 90] 
            },
            { 
              category: 'Team B', 
              values: [78, 82, 85, 88, 81, 84, 79, 86, 83, 87, 80, 85, 82, 84, 81] 
            },
            { 
              category: 'Team C', 
              values: [92, 95, 93, 97, 94, 96, 91, 98, 95, 94, 93, 96, 92, 95, 97] 
            }
          ]
        }
      }
    }
  })
  @ApiOkResponse({ description: 'Violin plot generated successfully', type: ChartResponseDto
   })
  @ApiBadRequestResponse({ description: 'Invalid violin plot distribution data provided' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error during chart generation' })
  async generateViolinChart(@Body() body: ViolinChartDto): Promise<ChartResponseDto> {
    return this.chartRenderService.renderChartToUrl({ type: 'violin', ...body });
  }

  @Post('word-cloud')
  @ApiOperation({
    summary: 'Generate Word Cloud Chart',
    description: 'Creates a word cloud visualization where word size represents frequency or importance, perfect for text analysis and keyword visualization.',
    operationId: 'generateWordCloudChart'
  })
  @ApiBody({
    description: 'Word cloud configuration with text and frequency data',
    type: WordCloudChartDto,
    examples: {
      'technology-trends': {
        summary: 'Technology Trends Word Cloud',
        description: 'Word cloud showing trending technologies and their popularity',
        value: {
          title: 'Technology Trends 2023',
          width: 800,
          height: 600,
          theme: 'default',
          data: [
            { text: 'JavaScript', value: 100 },
            { text: 'TypeScript', value: 85 },
            { text: 'React', value: 90 },
            { text: 'Node.js', value: 75 },
            { text: 'Python', value: 95 },
            { text: 'Docker', value: 70 },
            { text: 'Kubernetes', value: 65 },
            { text: 'AWS', value: 80 },
            { text: 'Machine Learning', value: 88 },
            { text: 'Artificial Intelligence', value: 92 },
            { text: 'Blockchain', value: 60 },
            { text: 'Cloud Computing', value: 78 },
            { text: 'DevOps', value: 72 },
            { text: 'Microservices', value: 68 }
          ]
        }
      }
    }
  })
  @ApiOkResponse({ description: 'Word cloud generated successfully', type: ChartResponseDto
   })
  @ApiBadRequestResponse({ description: 'Invalid word cloud data provided' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error during chart generation' })
  async generateWordCloudChart(@Body() body: WordCloudChartDto): Promise<ChartResponseDto> {
    return this.chartRenderService.renderChartToUrl({ type: 'word-cloud', ...body });
  }
}

