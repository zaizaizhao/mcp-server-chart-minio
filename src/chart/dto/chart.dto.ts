import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, IsNumber, IsEnum } from 'class-validator';

export enum ChartTheme {
  DEFAULT = 'default',
  ACADEMY = 'academy',
}

export class ChartRenderDto {
  @ApiProperty({
    description: 'Chart type (line, pie, column, bar, etc.)',
    example: 'line'
  })
  @IsString()
  type: string;

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
    description: 'Chart title (optional)',
    example: 'Sample Chart',
    required: false
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Chart width in pixels (optional, default: 800)',
    example: 800,
    required: false
  })
  @IsOptional()
  @IsNumber()
  width?: number;

  @ApiProperty({
    description: 'Chart height in pixels (optional, default: 600)',
    example: 600,
    required: false
  })
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiProperty({
    description: 'Chart theme (optional)',
    enum: ChartTheme,
    example: 'default',
    required: false
  })
  @IsOptional()
  @IsEnum(ChartTheme)
  theme?: ChartTheme;

  @ApiProperty({
    description: 'X-axis title',
    example: 'Time',
    required: false
  })
  @IsOptional()
  @IsString()
  axisXTitle?: string;

  @ApiProperty({
    description: 'Y-axis title',
    example: 'Value',
    required: false
  })
  @IsOptional()
  @IsString()
  axisYTitle?: string;
}
