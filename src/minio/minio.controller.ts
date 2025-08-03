import { Controller, Get, Post, Delete, Param, Query, Body } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiOkResponse, 
  ApiCreatedResponse,
  ApiParam, 
  ApiQuery, 
  ApiBody 
} from '@nestjs/swagger';
import { MinioService } from './minio.service';
import {
  BucketListItemDto,
  CreateBucketDto,
  MessageResponseDto,
  ObjectListItemDto
} from '../common/dto/common.dto';

@ApiTags('minio')
@Controller('minio')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @Get('buckets')
  @ApiOperation({ summary: 'List all buckets' })
  @ApiOkResponse({ 
    description: 'Returns list of all buckets',
    type: [BucketListItemDto]
  })
  async listBuckets(): Promise<BucketListItemDto[]> {
    const buckets = await this.minioService.listBuckets();
    return buckets.map(bucket => ({
      name: bucket.name,
      creationDate: bucket.creationDate.toISOString()
    }));
  }

  @Post('buckets')
  @ApiOperation({ summary: 'Create a new bucket' })
  @ApiBody({
    description: 'Bucket creation data',
    type: CreateBucketDto
  })
  @ApiCreatedResponse({ 
    description: 'Bucket created successfully',
    type: MessageResponseDto
  })
  async createBucket(@Body() createBucketDto: CreateBucketDto): Promise<MessageResponseDto> {
    return await this.minioService.createBucket(createBucketDto.name, createBucketDto.region);
  }

  @Delete('buckets/:bucketName')
  @ApiOperation({ summary: 'Delete a bucket' })
  @ApiParam({ name: 'bucketName', description: 'Name of the bucket to delete', example: 'my-bucket' })
  @ApiOkResponse({ 
    description: 'Bucket deleted successfully',
    type: MessageResponseDto
  })
  async deleteBucket(@Param('bucketName') bucketName: string): Promise<MessageResponseDto> {
    return await this.minioService.deleteBucket(bucketName);
  }

  @Get('buckets/:bucketName/objects')
  @ApiOperation({ summary: 'List objects in a bucket' })
  @ApiParam({ name: 'bucketName', description: 'Name of the bucket', example: 'my-bucket' })
  @ApiQuery({ name: 'prefix', required: false, description: 'Object prefix filter', example: 'folder/' })
  @ApiOkResponse({ 
    description: 'Returns list of objects in the bucket',
    type: [ObjectListItemDto]
  })
  async listObjects(
    @Param('bucketName') bucketName: string,
    @Query('prefix') prefix?: string,
  ): Promise<ObjectListItemDto[]> {
    const objects = await this.minioService.listObjects(bucketName, prefix);
    return (objects as any[]).map(obj => ({
      name: obj.name,
      size: obj.size,
      lastModified: obj.lastModified.toISOString()
    }));
  }
}
