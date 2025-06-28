import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, IsNumber, IsEnum } from 'class-validator';

export enum ChartTheme {
  DEFAULT = 'default',
  ACADEMY = 'academy',
}

export class BaseChartDto {
  @ApiProperty({
    description: 'Chart data array',
    example: [
      { time: '2020', value: 100 },
      { time: '2021', value: 120 },
      { time: '2022', value: 140 }
    ],
    type: 'array',
    items: {
      type: 'object',
      description: 'Data point object with key-value pairs'
    }
  })
  @IsArray()
  data: any[];

  @ApiProperty({
    description: 'Chart title',
    example: 'Monthly Sales Data',
    required: false
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Chart width in pixels',
    example: 800,
    default: 800,
    required: false
  })
  @IsOptional()
  @IsNumber()
  width?: number;

  @ApiProperty({
    description: 'Chart height in pixels',
    example: 600,
    default: 600,
    required: false
  })
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiProperty({
    description: 'Chart theme',
    enum: ChartTheme,
    example: ChartTheme.DEFAULT,
    default: ChartTheme.DEFAULT,
    required: false
  })
  @IsOptional()
  @IsEnum(ChartTheme)
  theme?: ChartTheme;
}

export class AreaChartDto extends BaseChartDto {
  @ApiProperty({
    description: 'Area chart data with x and y coordinates',
    example: [
      { time: '2020-01', value: 100 },
      { time: '2020-02', value: 120 },
      { time: '2020-03', value: 140 }
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        time: { type: 'string', description: 'Time period' },
        value: { type: 'number', description: 'Numeric value' }
      }
    }
  })
  @IsArray()
  data: Array<{ time: string; value: number }>;
}

export class BarChartDto extends BaseChartDto {
  @ApiProperty({
    description: 'Bar chart data with categories and values',
    example: [
      { category: 'Product A', value: 100 },
      { category: 'Product B', value: 200 },
      { category: 'Product C', value: 150 }
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        category: { type: 'string', description: 'Category name' },
        value: { type: 'number', description: 'Numeric value' }
      }
    }
  })
  @IsArray()
  data: Array<{ category: string; value: number }>;
}

export class PieChartDto extends BaseChartDto {
  @ApiProperty({
    description: 'Pie chart data with categories and values',
    example: [
      { category: 'Desktop', value: 61.41 },
      { category: 'Mobile', value: 30.77 },
      { category: 'Tablet', value: 7.82 }
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        category: { type: 'string', description: 'Category name' },
        value: { type: 'number', description: 'Percentage or count' }
      }
    }
  })
  @IsArray()
  data: Array<{ category: string; value: number }>;
}

export class LineChartDto extends BaseChartDto {
  @ApiProperty({
    description: 'Line chart data with x and y coordinates',
    example: [
      { x: '2020', y: 100 },
      { x: '2021', y: 120 },
      { x: '2022', y: 140 }
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        x: { type: 'string', description: 'X-axis value' },
        y: { type: 'number', description: 'Y-axis value' }
      }
    }
  })
  @IsArray()
  data: Array<{ x: string; y: number }>;
}

export class ScatterChartDto extends BaseChartDto {
  @ApiProperty({
    description: 'Scatter plot data with x and y coordinates',
    example: [
      { x: 161.2, y: 51.6 },
      { x: 167.5, y: 59.0 },
      { x: 159.5, y: 49.2 }
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        x: { type: 'number', description: 'X-axis coordinate' },
        y: { type: 'number', description: 'Y-axis coordinate' }
      }
    }
  })
  @IsArray()
  data: Array<{ x: number; y: number }>;
}

export class HistogramChartDto extends BaseChartDto {
  @ApiProperty({
    description: 'Histogram data with bins and frequencies',
    example: [
      { bin: '0-10', frequency: 5 },
      { bin: '10-20', frequency: 12 },
      { bin: '20-30', frequency: 8 }
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        bin: { type: 'string', description: 'Bin range' },
        frequency: { type: 'number', description: 'Frequency count' }
      }
    }
  })
  @IsArray()
  data: Array<{ bin: string; frequency: number }>;
}

export class BoxplotChartDto extends BaseChartDto {
  @ApiProperty({
    description: 'Boxplot data with statistical values',
    example: [
      { category: 'Group A', min: 10, q1: 15, median: 20, q3: 25, max: 30 },
      { category: 'Group B', min: 12, q1: 18, median: 22, q3: 28, max: 35 }
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        category: { type: 'string', description: 'Category name' },
        min: { type: 'number', description: 'Minimum value' },
        q1: { type: 'number', description: 'First quartile' },
        median: { type: 'number', description: 'Median value' },
        q3: { type: 'number', description: 'Third quartile' },
        max: { type: 'number', description: 'Maximum value' }
      }
    }
  })
  @IsArray()
  data: Array<{ category: string; min: number; q1: number; median: number; q3: number; max: number }>;
}

export class RadarChartDto extends BaseChartDto {
  @ApiProperty({
    description: 'Radar chart data with multiple dimensions',
    example: [
      { dimension: 'Speed', value: 85 },
      { dimension: 'Strength', value: 70 },
      { dimension: 'Defense', value: 90 },
      { dimension: 'Intelligence', value: 95 }
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        dimension: { type: 'string', description: 'Dimension name' },
        value: { type: 'number', description: 'Value for this dimension' }
      }
    }
  })
  @IsArray()
  data: Array<{ dimension: string; value: number }>;
}

export class TreemapChartDto extends BaseChartDto {
  @ApiProperty({
    description: 'Treemap data with hierarchical structure',
    example: [
      { name: 'Root', parent: '', value: 100 },
      { name: 'Category A', parent: 'Root', value: 60 },
      { name: 'Category B', parent: 'Root', value: 40 }
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Node name' },
        parent: { type: 'string', description: 'Parent node name' },
        value: { type: 'number', description: 'Node value' }
      }
    }
  })
  @IsArray()
  data: Array<{ name: string; parent: string; value: number }>;
}

export class WordCloudChartDto extends BaseChartDto {
  @ApiProperty({
    description: 'Word cloud data with words and frequencies',
    example: [
      { text: 'javascript', value: 100 },
      { text: 'typescript', value: 80 },
      { text: 'react', value: 60 },
      { text: 'nodejs', value: 70 }
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        text: { type: 'string', description: 'Word text' },
        value: { type: 'number', description: 'Word frequency or importance' }
      }
    }
  })
  @IsArray()
  data: Array<{ text: string; value: number }>;
}

export class ColumnChartDto extends BaseChartDto {
  @ApiProperty({
    description: 'Column chart data with categories and values',
    example: [
      { category: 'Q1', value: 100 },
      { category: 'Q2', value: 150 },
      { category: 'Q3', value: 120 },
      { category: 'Q4', value: 180 }
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        category: { type: 'string', description: 'Category name' },
        value: { type: 'number', description: 'Numeric value' }
      }
    }
  })
  @IsArray()
  data: Array<{ category: string; value: number }>;
}

export class DistrictMapDto extends BaseChartDto {
  @ApiProperty({
    description: 'District map data with geographic regions and values',
    example: [
      { district: 'Beijing', value: 100 },
      { district: 'Shanghai', value: 120 },
      { district: 'Guangzhou', value: 90 }
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        district: { type: 'string', description: 'District or region name' },
        value: { type: 'number', description: 'Value for this district' }
      }
    }
  })
  @IsArray()
  data: Array<{ district: string; value: number }>;
}

export class DualAxesDto extends BaseChartDto {
  @ApiProperty({
    description: 'Dual axes chart data with two different value series',
    example: [
      { time: '2020', sales: 100, profit: 20 },
      { time: '2021', sales: 120, profit: 25 },
      { time: '2022', sales: 140, profit: 30 }
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        time: { type: 'string', description: 'Time period' },
        sales: { type: 'number', description: 'Sales value (left axis)' },
        profit: { type: 'number', description: 'Profit value (right axis)' }
      }
    }
  })
  @IsArray()
  data: Array<{ time: string; sales: number; profit: number }>;
}

export class FishboneDiagramDto extends BaseChartDto {
  @ApiProperty({
    description: 'Fishbone diagram data with causes and categories',
    example: [
      { category: 'People', cause: 'Lack of training' },
      { category: 'Process', cause: 'Inefficient workflow' },
      { category: 'Equipment', cause: 'Old machinery' }
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        category: { type: 'string', description: 'Cause category' },
        cause: { type: 'string', description: 'Specific cause description' }
      }
    }
  })
  @IsArray()
  data: Array<{ category: string; cause: string }>;
}

export class FlowDiagramDto extends BaseChartDto {
  @ApiProperty({
    description: 'Flow diagram data with nodes and connections',
    example: [
      { id: '1', label: 'Start', type: 'start' },
      { id: '2', label: 'Process', type: 'process' },
      { id: '3', label: 'End', type: 'end' },
      { from: '1', to: '2' },
      { from: '2', to: '3' }
    ],
    type: 'array',
    items: {
      type: 'object',
      description: 'Node or edge object'
    }
  })
  @IsArray()
  data: Array<any>;
}

export class FunnelChartDto extends BaseChartDto {
  @ApiProperty({
    description: 'Funnel chart data with stages and values',
    example: [
      { stage: 'Awareness', value: 1000 },
      { stage: 'Interest', value: 800 },
      { stage: 'Consideration', value: 500 },
      { stage: 'Purchase', value: 200 }
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        stage: { type: 'string', description: 'Funnel stage name' },
        value: { type: 'number', description: 'Number of items in this stage' }
      }
    }
  })
  @IsArray()
  data: Array<{ stage: string; value: number }>;
}

export class LiquidChartDto extends BaseChartDto {
  @ApiProperty({
    description: 'Liquid chart data with percentage value',
    example: [
      { percent: 0.65 }
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        percent: { type: 'number', description: 'Percentage value (0-1)' }
      }
    }
  })
  @IsArray()
  data: Array<{ percent: number }>;
}

export class MindMapDto extends BaseChartDto {
  @ApiProperty({
    description: 'Mind map data with hierarchical structure',
    example: [
      { id: '1', name: 'Central Topic', parent: null },
      { id: '2', name: 'Branch 1', parent: '1' },
      { id: '3', name: 'Branch 2', parent: '1' },
      { id: '4', name: 'Sub-branch', parent: '2' }
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Node ID' },
        name: { type: 'string', description: 'Node name' },
        parent: { type: 'string', description: 'Parent node ID', nullable: true }
      }
    }
  })
  @IsArray()
  data: Array<{ id: string; name: string; parent: string | null }>;
}

export class NetworkGraphDto extends BaseChartDto {
  @ApiProperty({
    description: 'Network graph data with nodes and edges',
    example: [
      { id: 'A', label: 'Node A' },
      { id: 'B', label: 'Node B' },
      { id: 'C', label: 'Node C' },
      { source: 'A', target: 'B' },
      { source: 'B', target: 'C' }
    ],
    type: 'array',
    items: {
      type: 'object',
      description: 'Node or edge object'
    }
  })
  @IsArray()
  data: Array<any>;
}

export class OrganizationChartDto extends BaseChartDto {
  @ApiProperty({
    description: 'Organization chart data with hierarchical structure',
    example: [
      { id: '1', name: 'CEO', title: 'Chief Executive Officer', parent: null },
      { id: '2', name: 'CTO', title: 'Chief Technology Officer', parent: '1' },
      { id: '3', name: 'CFO', title: 'Chief Financial Officer', parent: '1' }
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Employee ID' },
        name: { type: 'string', description: 'Employee name' },
        title: { type: 'string', description: 'Job title' },
        parent: { type: 'string', description: 'Manager ID', nullable: true }
      }
    }
  })
  @IsArray()
  data: Array<{ id: string; name: string; title: string; parent: string | null }>;
}

export class PathMapDto extends BaseChartDto {
  @ApiProperty({
    description: 'Path map data with geographic paths and routes',
    example: [
      { from: 'Beijing', to: 'Shanghai', value: 100 },
      { from: 'Shanghai', to: 'Guangzhou', value: 80 },
      { from: 'Guangzhou', to: 'Shenzhen', value: 60 }
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        from: { type: 'string', description: 'Starting location' },
        to: { type: 'string', description: 'Destination location' },
        value: { type: 'number', description: 'Path value or traffic' }
      }
    }
  })
  @IsArray()
  data: Array<{ from: string; to: string; value: number }>;
}

export class PinMapDto extends BaseChartDto {
  @ApiProperty({
    description: 'Pin map data with geographic coordinates and values',
    example: [
      { lat: 39.9042, lng: 116.4074, name: 'Beijing', value: 100 },
      { lat: 31.2304, lng: 121.4737, name: 'Shanghai', value: 120 },
      { lat: 23.1291, lng: 113.2644, name: 'Guangzhou', value: 90 }
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        lat: { type: 'number', description: 'Latitude coordinate' },
        lng: { type: 'number', description: 'Longitude coordinate' },
        name: { type: 'string', description: 'Location name' },
        value: { type: 'number', description: 'Value at this location' }
      }
    }
  })
  @IsArray()
  data: Array<{ lat: number; lng: number; name: string; value: number }>;
}

export class SankeyChartDto extends BaseChartDto {
  @ApiProperty({
    description: 'Sankey diagram data with flows between nodes',
    example: [
      { source: 'Energy', target: 'Electricity', value: 100 },
      { source: 'Energy', target: 'Heat', value: 50 },
      { source: 'Electricity', target: 'Lighting', value: 30 },
      { source: 'Electricity', target: 'Appliances', value: 70 }
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        source: { type: 'string', description: 'Source node' },
        target: { type: 'string', description: 'Target node' },
        value: { type: 'number', description: 'Flow value' }
      }
    }
  })
  @IsArray()
  data: Array<{ source: string; target: string; value: number }>;
}

export class VennChartDto extends BaseChartDto {
  @ApiProperty({
    description: 'Venn diagram data with sets and intersections',
    example: [
      { sets: ['A'], size: 12 },
      { sets: ['B'], size: 12 },
      { sets: ['A', 'B'], size: 2 }
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        sets: { type: 'array', items: { type: 'string' }, description: 'Set names' },
        size: { type: 'number', description: 'Size of intersection' }
      }
    }
  })
  @IsArray()
  data: Array<{ sets: string[]; size: number }>;
}

export class ViolinChartDto extends BaseChartDto {
  @ApiProperty({
    description: 'Violin plot data with distribution values',
    example: [
      { category: 'Group A', values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      { category: 'Group B', values: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20] }
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        category: { type: 'string', description: 'Category name' },
        values: { type: 'array', items: { type: 'number' }, description: 'Distribution values' }
      }
    }
  })
  @IsArray()
  data: Array<{ category: string; values: number[] }>;
}

export class ChartResponseDto {
  @ApiProperty({
    description: 'MinIO URL to access the rendered chart image',
    example: 'http://localhost:9000/charts/chart-uuid.png?X-Amz-...'
  })
  url: string;

  @ApiProperty({
    description: 'Generated filename in MinIO storage',
    example: 'chart-12345678-1234-1234-1234-123456789abc.png'
  })
  filename: string;
}
