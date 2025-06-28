import { Controller, Get, Post, Delete, Param, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { MinioService } from './minio.service';

@ApiTags('minio')
@Controller('minio')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @Get('buckets')
  @ApiOperation({ summary: 'List all buckets' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns list of all buckets',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'my-bucket' },
          creationDate: { type: 'string', example: '2025-06-25T14:57:00.000Z' }
        }
      }
    }
  })
  async listBuckets() {
    return await this.minioService.listBuckets();
  }

  @Post('buckets')
  @ApiOperation({ summary: 'Create a new bucket' })
  @ApiBody({
    description: 'Bucket creation data',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'my-new-bucket', description: 'Bucket name' },
        region: { type: 'string', example: 'us-east-1', description: 'Bucket region (optional)' }
      },
      required: ['name']
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Bucket created successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Bucket \'my-new-bucket\' created successfully' }
      }
    }
  })
  async createBucket(@Body() createBucketDto: { name: string; region?: string }) {
    return await this.minioService.createBucket(createBucketDto.name, createBucketDto.region);
  }

  @Delete('buckets/:bucketName')
  @ApiOperation({ summary: 'Delete a bucket' })
  @ApiParam({ name: 'bucketName', description: 'Name of the bucket to delete', example: 'my-bucket' })
  @ApiResponse({ 
    status: 200, 
    description: 'Bucket deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Bucket \'my-bucket\' deleted successfully' }
      }
    }
  })
  async deleteBucket(@Param('bucketName') bucketName: string) {
    return await this.minioService.deleteBucket(bucketName);
  }

  @Get('buckets/:bucketName/objects')
  @ApiOperation({ summary: 'List objects in a bucket' })
  @ApiParam({ name: 'bucketName', description: 'Name of the bucket', example: 'my-bucket' })
  @ApiQuery({ name: 'prefix', required: false, description: 'Object prefix filter', example: 'folder/' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns list of objects in the bucket',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'my-file.txt' },
          size: { type: 'number', example: 1024 },
          lastModified: { type: 'string', example: '2025-06-25T14:57:00.000Z' }
        }
      }
    }
  })
  async listObjects(
    @Param('bucketName') bucketName: string,
    @Query('prefix') prefix?: string,
  ) {
    return await this.minioService.listObjects(bucketName, prefix);
  }
}
