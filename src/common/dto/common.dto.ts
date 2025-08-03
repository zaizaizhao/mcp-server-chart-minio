import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto<T = any> {
  @ApiProperty({
    description: 'Indicates if the operation was successful',
    example: true
  })
  success: boolean;

  @ApiProperty({
    description: 'Error message if operation failed, null if successful',
    example: null,
    nullable: true
  })
  errorMessage: string | null;

  @ApiProperty({
    description: 'Result data or formatted string',
    example: 'Operation completed successfully'
  })
  resultObj: T;
}

export class ChartRenderResponseDto extends BaseResponseDto<string> {
  @ApiProperty({
    description: 'Markdown formatted string containing chart image and details',
    example: '![Chart](http://localhost:9000/charts/chart-uuid.png)\n\nChart rendered successfully. Direct URL: http://localhost:9000/charts/chart-uuid.png'
  })
  resultObj: string;
}

export class SupportedTypesResponseDto {
  @ApiProperty({
    description: 'List of supported chart types',
    example: ['line', 'pie', 'column', 'bar', 'scatter', 'area'],
    type: [String]
  })
  types: string[];
}

export class HealthResponseDto {
  @ApiProperty({
    description: 'Health status',
    example: 'ok'
  })
  status: string;

  @ApiProperty({
    description: 'Timestamp of the health check',
    example: '2025-08-03T12:00:00.000Z'
  })
  timestamp: string;

  @ApiProperty({
    description: 'Service name',
    example: 'MCP Server Chart MinIO'
  })
  service: string;
}

export class BucketListItemDto {
  @ApiProperty({
    description: 'Bucket name',
    example: 'my-bucket'
  })
  name: string;

  @ApiProperty({
    description: 'Bucket creation date',
    example: '2025-08-03T12:00:00.000Z'
  })
  creationDate: string;
}

export class CreateBucketDto {
  @ApiProperty({
    description: 'Bucket name',
    example: 'my-new-bucket'
  })
  name: string;

  @ApiProperty({
    description: 'Bucket region (optional)',
    example: 'us-east-1',
    required: false
  })
  region?: string;
}

export class MessageResponseDto {
  @ApiProperty({
    description: 'Response message',
    example: 'Operation completed successfully'
  })
  message: string;
}

export class ObjectListItemDto {
  @ApiProperty({
    description: 'Object name',
    example: 'my-file.txt'
  })
  name: string;

  @ApiProperty({
    description: 'Object size in bytes',
    example: 1024
  })
  size: number;

  @ApiProperty({
    description: 'Last modified date',
    example: '2025-08-03T12:00:00.000Z'
  })
  lastModified: string;
}
