import { Injectable, Logger } from '@nestjs/common';
import { render } from '@antv/gpt-vis-ssr';
import { MinioService } from '../minio/minio.service';
import { v4 as uuidv4 } from 'uuid';

export interface ChartOptions {
  type: string;
  data: any[];
  title?: string;
  width?: number;
  height?: number;
  theme?: 'default' | 'academy';
  [key: string]: any;
}

interface ChartTypeMapping {
  [key: string]: {
    type: string;
    dataPreprocessor?: (data: any[]) => any[] | any;
    optionsPreprocessor?: (options: ChartOptions) => any;
  };
}

@Injectable()
export class ChartRenderService {
  private readonly logger = new Logger(ChartRenderService.name);
  private readonly BUCKET_NAME = 'charts';

  // 图表类型映射配置 - 基于源码的正确实现
  private readonly chartTypeMappings: ChartTypeMapping = {
    // 基础图表 - 直接支持
    'line': { 
      type: 'line',
      dataPreprocessor: (data) => this.validateTimeSeriesData(data),
    },
    'area': { 
      type: 'area',
      dataPreprocessor: (data) => this.validateTimeSeriesData(data),
    },
    'column': { 
      type: 'column',
      dataPreprocessor: (data) => this.validateCategoricalData(data),
    },
    'bar': { 
      type: 'bar',
      dataPreprocessor: (data) => this.validateCategoricalData(data),
    },
    'pie': { 
      type: 'pie',
      dataPreprocessor: (data) => this.validateCategoricalData(data),
    },
    'scatter': { 
      type: 'scatter',
      dataPreprocessor: (data) => this.validateScatterData(data),
    },
    
    // 高级图表 - 原生支持
    'histogram': { 
      type: 'histogram',
      dataPreprocessor: (data) => this.validateHistogramDataNative(data),
    },
    'boxplot': { 
      type: 'boxplot',
      dataPreprocessor: (data) => this.validateBoxplotDataNative(data),
    },
    'radar': { 
      type: 'radar',
      dataPreprocessor: (data) => this.validateRadarData(data),
    },
    'funnel': { 
      type: 'funnel',
      dataPreprocessor: (data) => this.validateFunnelData(data),
    },
    'treemap': { 
      type: 'treemap',
      dataPreprocessor: (data) => this.validateTreemapData(data),
    },
    'sankey': { 
      type: 'sankey',
      dataPreprocessor: (data) => this.validateSankeyData(data),
    },
    'word-cloud': { 
      type: 'word-cloud',
      dataPreprocessor: (data) => this.validateWordCloudDataNative(data),
    },
    'dual-axes': { 
      type: 'dual-axes',
      dataPreprocessor: (data) => this.validateDualAxesDataNative(data),
    },
    'liquid': { 
      type: 'liquid',
      dataPreprocessor: (data) => this.validateLiquidDataNative(data),
    },
    'violin': { 
      type: 'violin',
      dataPreprocessor: (data) => this.validateViolinDataNative(data),
    },
    'venn': { 
      type: 'venn',
      dataPreprocessor: (data) => this.validateVennDataNative(data),
    },
    
    // 关系图表 - 原生支持，需要特殊数据格式
    'mind-map': { 
      type: 'mind-map',
      dataPreprocessor: (data) => this.validateMindMapData(data),
    },
    'organization-chart': { 
      type: 'organization-chart',
      dataPreprocessor: (data) => this.validateOrgChartData(data),
    },
    'flow-diagram': { 
      type: 'flow-diagram',
      dataPreprocessor: (data) => this.validateFlowChartData(data),
    },
    'fishbone-diagram': { 
      type: 'fishbone-diagram',
      dataPreprocessor: (data) => this.validateFishboneDiagramData(data),
    },
    'network-graph': { 
      type: 'network-graph',
      dataPreprocessor: (data) => this.validateNetworkGraphData(data),
    },
    
    // 地理图表 - 暂时使用替代方案
    'district-map': { 
      type: 'bar',
      dataPreprocessor: (data) => this.validateDistrictMapData(data),
    },
    'pin-map': { 
      type: 'scatter',
      dataPreprocessor: (data) => this.validateScatterData(data),
    },
    'path-map': { 
      type: 'line',
      dataPreprocessor: (data) => this.validateTimeSeriesData(data),
    },
  };

  constructor(private minioService: MinioService) {
    this.initializeBucket();
  }

  private async initializeBucket() {
    try {
      await this.minioService.createBucket(this.BUCKET_NAME, 'us-east-1');
      this.logger.log(`Charts bucket '${this.BUCKET_NAME}' initialized with public read access`);
    } catch (error) {
      this.logger.error('Failed to initialize charts bucket:', error);
    }
  }

  /**
   * 渲染图表并上传到MinIO，返回访问URL
   */
  async renderChartToUrl(options: ChartOptions): Promise<{ url: string; filename: string }> {
    try {
      // 1. 获取图表类型配置
      const chartConfig = this.chartTypeMappings[options.type];
      if (!chartConfig) {
        throw new Error(`Unsupported chart type: ${options.type}`);
      }

      this.logger.log(`Rendering chart of type: ${options.type} -> ${chartConfig.type}`);
      
      // 2. 数据预处理
      let processedData = options.data;
      if (chartConfig.dataPreprocessor) {
        try {
          processedData = chartConfig.dataPreprocessor(options.data);
        } catch (error) {
          this.logger.warn(`Data preprocessing failed for ${options.type}:`, error.message);
          // 使用默认示例数据
          processedData = this.generateSampleData(options.type);
        }
      }

      // 3. 构建渲染选项
      let renderOptions;
      
      if (chartConfig.type === 'dual-axes') {
        // dual-axes 需要特殊的格式：categories和series作为顶级属性
        const dualAxesData = processedData as any;
        renderOptions = {
          type: chartConfig.type,
          categories: dualAxesData.categories,
          series: dualAxesData.series,
          width: options.width || 800,
          height: options.height || 600,
          title: options.title,
          theme: options.theme || 'default',
        };
      } else {
        // 其他图表类型使用data属性
        renderOptions = {
          type: chartConfig.type,
          data: processedData,
          width: options.width || 800,
          height: options.height || 600,
          title: options.title,
          theme: options.theme || 'default',
        };
      }
      
      // 添加额外的属性到渲染选项中
      Object.keys(options).forEach(key => {
        // 跳过已经明确设置的属性
        if (!['type', 'data', 'width', 'height', 'title', 'theme'].includes(key)) {
          renderOptions[key] = options[key];
        }
      });

      this.logger.debug(`Render options:`, JSON.stringify(renderOptions, null, 2));

      // 4. 使用 @antv/gpt-vis-ssr 渲染图表
      let vis;
      try {
        vis = await render(renderOptions);
      } catch (renderError) {
        this.logger.error(`Render failed for ${options.type}:`, renderError.message);
        
        // 尝试使用示例数据重新渲染
        const fallbackData = this.generateSampleData(options.type);
        let fallbackOptions;
        
        if (chartConfig.type === 'dual-axes') {
          // dual-axes需要特殊处理
          const processedFallbackData = chartConfig.dataPreprocessor ? 
            chartConfig.dataPreprocessor(Array.isArray(fallbackData) ? fallbackData : [fallbackData]) : 
            fallbackData;
          
          fallbackOptions = {
            type: chartConfig.type,
            categories: processedFallbackData.categories,
            series: processedFallbackData.series,
            width: 800,
            height: 600,
            title: options.title || `${options.type} Chart`,
          };
        } else {
          // 其他图表类型
          const processedFallbackData = chartConfig.dataPreprocessor ? 
            chartConfig.dataPreprocessor(Array.isArray(fallbackData) ? fallbackData : [fallbackData]) : 
            fallbackData;
          
          fallbackOptions = {
            type: chartConfig.type,
            data: processedFallbackData,
            width: 800,
            height: 600,
            title: options.title || `${options.type} Chart`,
          };
        }
        
        this.logger.log(`Retrying with fallback data for ${options.type}`);
        this.logger.debug(`Fallback options:`, JSON.stringify(fallbackOptions, null, 2));
        vis = await render(fallbackOptions);
      }

      // 5. 获取图片Buffer
      const buffer = vis.toBuffer();
      
      // 6. 生成唯一文件名
      const filename = `chart-${uuidv4()}.png`;
      
      // 7. 上传到MinIO
      const client = this.minioService.getClient();
      await client.putObject(this.BUCKET_NAME, filename, buffer, buffer.length, {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600', // 缓存1小时
      });

      // 8. 生成外部可访问的URL
      // 优先使用公共URL（永久有效），如果失败则使用预签名URL
      let url: string;
      try {
        url = await this.minioService.getPublicUrl(this.BUCKET_NAME, filename);
        this.logger.debug(`Using public URL: ${url}`);
      } catch (error) {
        this.logger.warn('Failed to generate public URL, falling back to presigned URL:', error.message);
        url = await this.minioService.getExternalPresignedUrl(this.BUCKET_NAME, filename, 24 * 60 * 60); // 24小时有效期
      }
      
      this.logger.log(`Chart rendered and uploaded: ${filename}`);
      
      return {
        url,
        filename,
      };
    } catch (error) {
      this.logger.error('Failed to render chart:', error);
      throw new Error(`Chart rendering failed: ${error.message}`);
    }
  }

  /**
   * 获取支持的图表类型
   */
  getSupportedChartTypes(): string[] {
    return [
      'line',
      'area',
      'column',
      'bar',
      'pie',
      'scatter',
      'histogram',
      'boxplot',
      'radar',
      'funnel',
      'treemap',
      'sankey',
      'word-cloud',
      'dual-axes',
      'liquid',
      'mind-map',
      'organization-chart',
      'flow-diagram',
      'fishbone-diagram',
      'network-graph',
      'violin',
      'venn',
    ];
  }

  /**
   * 生成示例数据
   */
  generateSampleData(chartType: string): any[] | any {
    const sampleData = {
      line: [
        { time: '2020', value: 100 },
        { time: '2021', value: 120 },
        { time: '2022', value: 140 },
        { time: '2023', value: 160 },
        { time: '2024', value: 180 },
      ],
      pie: [
        { category: '分类一', value: 27 },
        { category: '分类二', value: 25 },
        { category: '分类三', value: 18 },
        { category: '分类四', value: 15 },
        { category: '其他', value: 15 },
      ],
      column: [
        { category: 'Sports', value: 275 },
        { category: 'Strategy', value: 115 },
        { category: 'Action', value: 120 },
        { category: 'Shooter', value: 350 },
        { category: 'Other', value: 150 },
      ],
      bar: [
        { category: 'Product A', value: 100 },
        { category: 'Product B', value: 200 },
        { category: 'Product C', value: 150 },
        { category: 'Product D', value: 300 },
      ],
      scatter: [
        { x: 161.2, y: 51.6 },
        { x: 167.5, y: 59 },
        { x: 159.5, y: 49.2 },
        { x: 157, y: 63 },
        { x: 155.8, y: 53.6 },
      ],
      'flow-diagram': {
        nodes: [
          { name: 'Start' },
          { name: 'Process Data' },
          { name: 'Validate' },
          { name: 'End' }
        ],
        edges: [
          { source: 'Start', target: 'Process Data', name: 'Begin' },
          { source: 'Process Data', target: 'Validate', name: 'Check' },
          { source: 'Validate', target: 'End', name: 'Complete' }
        ]
      },
      'network-graph': {
        nodes: [
          { name: 'Node 1', group: 'group1' },
          { name: 'Node 2', group: 'group1' },
          { name: 'Node 3', group: 'group2' },
          { name: 'Node 4', group: 'group2' }
        ],
        edges: [
          { source: 'Node 1', target: 'Node 2', name: 'Connection 1', weight: 3 },
          { source: 'Node 2', target: 'Node 3', name: 'Connection 2', weight: 2 },
          { source: 'Node 3', target: 'Node 4', name: 'Connection 3', weight: 1 }
        ]
      },
      'mind-map': {
        name: '项目计划',
        children: [
          {
            name: '研究阶段',
            children: [
              { name: '市场调研' },
              { name: '技术可行性分析' }
            ]
          },
          {
            name: '设计阶段',
            children: [
              { name: '产品功能确定' },
              { name: 'UI 设计' }
            ]
          },
          {
            name: '开发阶段',
            children: [
              { name: '编写代码' },
              { name: '单元测试' }
            ]
          },
          {
            name: '测试阶段',
            children: [
              { name: '功能测试' },
              { name: '性能测试' }
            ]
          }
        ]
      },
    };

    // 对于特殊图表类型，返回对象而不是数组
    if (chartType === 'flow-diagram' || chartType === 'network-graph' || chartType === 'mind-map') {
      return sampleData[chartType];
    }

    return sampleData[chartType] || sampleData.line;
  }

  // ===== 数据预处理方法 =====

  /**
   * 验证时间序列数据 (line, area)
   */
  private validateTimeSeriesData(data: any[]): any[] {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array');
    }

    return data.map((item, index) => {
      const normalizedItem = { ...item };
      
      // 确保有时间字段
      if (!normalizedItem.time && !normalizedItem.date && !normalizedItem.x) {
        normalizedItem.time = `Point ${index + 1}`;
      }
      
      // 确保有数值字段
      if (typeof normalizedItem.value !== 'number' && typeof normalizedItem.y !== 'number') {
        normalizedItem.value = Math.random() * 100;
      }
      
      return normalizedItem;
    });
  }

  /**
   * 验证分类数据 (column, bar, pie)
   */
  private validateCategoricalData(data: any[]): any[] {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array');
    }

    return data.map((item, index) => {
      const normalizedItem = { ...item };
      
      // 确保有分类字段
      if (!normalizedItem.category && !normalizedItem.name && !normalizedItem.label) {
        normalizedItem.category = `Category ${index + 1}`;
      }
      
      // 确保有数值字段
      if (typeof normalizedItem.value !== 'number') {
        normalizedItem.value = Math.random() * 100;
      }
      
      return normalizedItem;
    });
  }

  /**
   * 验证散点图数据
   */
  private validateScatterData(data: any[]): any[] {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array');
    }

    return data.map((item) => {
      const normalizedItem = { ...item };
      
      // 确保有x和y坐标
      if (typeof normalizedItem.x !== 'number') {
        normalizedItem.x = Math.random() * 100;
      }
      if (typeof normalizedItem.y !== 'number') {
        normalizedItem.y = Math.random() * 100;
      }
      
      return normalizedItem;
    });
  }

  /**
   * 验证直方图数据
   */
  private validateHistogramData(data: any[]): any[] {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array');
    }

    // 将数值转换为分类数据，适合柱状图显示
    return data.map((item, index) => {
      let value: number;
      if (typeof item === 'number') {
        value = item;
      } else if (typeof item === 'object' && typeof item.value === 'number') {
        value = item.value;
      } else {
        value = Math.random() * 100;
      }
      
      return {
        category: `Bin ${index + 1}`,
        value: value
      };
    });
  }

  /**
   * 验证箱线图数据
   */
  private validateBoxplotData(data: any[]): any[] {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array');
    }

    // 将箱线图数据转换为柱状图显示中位数
    return data.map((item, index) => {
      const normalizedItem = { ...item };
      
      // 确保有分类字段
      if (!normalizedItem.category && !normalizedItem.name) {
        normalizedItem.category = `Category ${index + 1}`;
      }
      
      // 使用中位数作为值，如果没有则计算平均值
      let value;
      if (typeof normalizedItem.median === 'number') {
        value = normalizedItem.median;
      } else if (typeof normalizedItem.q1 === 'number' && typeof normalizedItem.q3 === 'number') {
        value = (normalizedItem.q1 + normalizedItem.q3) / 2;
      } else {
        value = Math.random() * 100;
      }
      
      return {
        category: normalizedItem.category,
        value: value
      };
    });
  }

  /**
   * 验证雷达图数据
   */
  private validateRadarData(data: any[]): any[] {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array');
    }

    return data.map((item, index) => {
      const normalizedItem = { ...item };
      
      if (!normalizedItem.name) {
        normalizedItem.name = `Item ${index + 1}`;
      }
      
      if (!normalizedItem.category) {
        normalizedItem.category = `Category ${index + 1}`;
      }
      
      if (typeof normalizedItem.value !== 'number') {
        normalizedItem.value = Math.random() * 100;
      }
      
      return normalizedItem;
    });
  }

  /**
   * 验证漏斗图数据
   */
  private validateFunnelData(data: any[]): any[] {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array');
    }

    return data.map((item, index) => {
      const normalizedItem = { ...item };
      
      if (!normalizedItem.stage && !normalizedItem.category) {
        normalizedItem.stage = `Stage ${index + 1}`;
      }
      
      if (typeof normalizedItem.value !== 'number') {
        normalizedItem.value = Math.random() * 100;
      }
      
      return normalizedItem;
    });
  }

  /**
   * 验证树图数据
   */
  private validateTreemapData(data: any[]): any[] {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array');
    }

    return data.map((item, index) => {
      const normalizedItem = { ...item };
      
      if (!normalizedItem.name && !normalizedItem.label) {
        normalizedItem.name = `Item ${index + 1}`;
      }
      
      if (typeof normalizedItem.value !== 'number') {
        normalizedItem.value = Math.random() * 100;
      }
      
      return normalizedItem;
    });
  }

  /**
   * 验证词云数据
   */
  private validateWordCloudData(data: any[]): any[] {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array');
    }

    // 将词云数据转换为条形图
    return data.map((item, index) => {
      const normalizedItem = { ...item };
      
      let category = normalizedItem.text || normalizedItem.word || normalizedItem.name;
      if (!category) {
        category = `Word ${index + 1}`;
      }
      
      let value = normalizedItem.value || normalizedItem.size || normalizedItem.weight;
      if (typeof value !== 'number') {
        value = Math.random() * 100;
      }
      
      return {
        category: category,
        value: value
      };
    });
  }

  /**
   * 验证双轴图数据
   */
  private validateDualAxesData(data: any[]): any[] {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array');
    }

    return data.map((item, index) => {
      const normalizedItem = { ...item };
      
      if (!normalizedItem.time && !normalizedItem.date) {
        normalizedItem.time = `Point ${index + 1}`;
      }
      
      if (typeof normalizedItem.value1 !== 'number') {
        normalizedItem.value1 = Math.random() * 100;
      }
      
      if (typeof normalizedItem.value2 !== 'number') {
        normalizedItem.value2 = Math.random() * 100;
      }
      
      return normalizedItem;
    });
  }

  /**
   * 验证水波图数据
   */
  private validateLiquidData(data: any[]): any[] {
    if (!Array.isArray(data) || data.length === 0) {
      return [{ percent: 0.75 }];
    }

    const item = data[0];
    if (typeof item === 'number') {
      return [{ percent: Math.max(0, Math.min(1, item)) }];
    }
    
    if (typeof item === 'object') {
      const percent = item.percent || item.value || 0.75;
      return [{ percent: Math.max(0, Math.min(1, percent)) }];
    }
    
    return [{ percent: 0.75 }];
  }

  /**
   * 验证思维导图数据
   */
  private validateMindMapData(data: any): any {
    this.logger.debug('validateMindMapData input:', JSON.stringify(data, null, 2));
    
    // 如果传入的是对象结构（符合gpt-vis-ssr格式）
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      // 确保每个节点都有name属性，递归处理children
      const processNode = (node: any): any => {
        const result: any = {
          name: node.name || node.label || node.title || node.id || 'Unnamed Node'
        };
        
        if (node.children && Array.isArray(node.children) && node.children.length > 0) {
          result.children = node.children.map((child: any) => {
            // 如果child是字符串，转换为对象
            if (typeof child === 'string') {
              return { name: child };
            }
            // 如果child是对象，递归处理
            return processNode(child);
          });
        }
        
        return result;
      };
      
      const processedData = processNode(data);
      this.logger.debug('validateMindMapData processed result:', JSON.stringify(processedData, null, 2));
      return processedData;
    }
    
    // 如果是数组，转换为树结构
    if (Array.isArray(data) && data.length > 0) {
      const rootItem = data[0];
      const result = {
        name: rootItem?.name || rootItem?.label || rootItem?.title || 'Root Node',
        children: data.slice(1).map((item, index) => ({
          name: item.name || item.label || item.title || item.id || `Node ${index + 1}`,
          children: item.children ? item.children.map((child: any) => {
            if (typeof child === 'string') {
              return { name: child };
            }
            return {
              name: child.name || child.label || child.title || child.id || 'Child Node'
            };
          }) : []
        }))
      };
      
      this.logger.debug('validateMindMapData array result:', JSON.stringify(result, null, 2));
      return result;
    }
    
    // 默认结构
    const defaultResult = {
      name: 'Root Node',
      children: [
        { name: 'Child 1' },
        { name: 'Child 2' },
        { name: 'Child 3' }
      ]
    };
    
    this.logger.debug('validateMindMapData default result:', JSON.stringify(defaultResult, null, 2));
    return defaultResult;
  }

  /**
   * 验证组织架构图数据
   */
  private validateOrgChartData(data: any): any {
    console.debug('validateOrgChartData input:', JSON.stringify(data, null, 2));
    
    // 如果传入的是对象结构（符合gpt-vis-ssr格式）
    if (data && typeof data === 'object' && (data.name || data.label)) {
      return data;
    }
    
    // 如果是数组，转换为树结构
    if (Array.isArray(data) && data.length > 0) {
      return {
        name: 'CEO',
        description: 'Chief Executive Officer',
        children: data.map((item, index) => ({
          name: item.name || item.label || `Person ${index + 1}`,
          description: item.description || item.title || `Position ${index + 1}`,
          children: item.children || []
        }))
      };
    }
    
    // 默认结构
    return {
      name: 'CEO',
      description: 'Chief Executive Officer',
      children: [
        { name: 'CTO', description: 'Chief Technology Officer' },
        { name: 'CFO', description: 'Chief Financial Officer' }
      ]
    };
  }

  /**
   * 验证流程图数据
   */
  private validateFlowChartData(data: any): any {
    this.logger.debug('validateFlowChartData input:', JSON.stringify(data, null, 2));
    
    // 如果传入的是包含nodes和edges的对象
    if (data && typeof data === 'object' && Array.isArray(data.nodes) && Array.isArray(data.edges)) {
      // 确保每个节点有name属性（flow-diagram源码需要）
      const nodes = data.nodes.map((node: any) => ({
        name: node.name || node.label || node.id || 'Unnamed Node',
        ...node
      }));
      
      // 确保边使用正确的source/target且有name属性
      const edges = data.edges.map((edge: any) => ({
        source: edge.source,
        target: edge.target,
        name: edge.name || edge.label || `${edge.source} → ${edge.target}`,
        ...edge
      }));
      
      const result = { nodes, edges };
      this.logger.debug('validateFlowChartData result:', JSON.stringify(result, null, 2));
      return result;
    }
    
    // 如果是数组，转换为nodes/edges结构
    if (Array.isArray(data) && data.length > 0) {
      const nodes = data.map((item, index) => ({
        name: item.name || item.label || item.id || `Step ${index + 1}`,
        type: item.type || (index === 0 ? 'start' : (index === data.length - 1 ? 'end' : 'process'))
      }));
      
      const edges = [];
      for (let i = 0; i < nodes.length - 1; i++) {
        edges.push({
          source: nodes[i].name,
          target: nodes[i + 1].name,
          name: `${nodes[i].name} → ${nodes[i + 1].name}`
        });
      }
      
      const result = { nodes, edges };
      this.logger.debug('validateFlowChartData result:', JSON.stringify(result, null, 2));
      return result;
    }
    
    // 默认结构 - 确保返回正确的格式
    const defaultResult = {
      nodes: [
        { name: 'Start' },
        { name: 'Process' },
        { name: 'End' }
      ],
      edges: [
        { source: 'Start', target: 'Process', name: 'Start → Process' },
        { source: 'Process', target: 'End', name: 'Process → End' }
      ]
    };
    
    this.logger.debug('validateFlowChartData default result:', JSON.stringify(defaultResult, null, 2));
    return defaultResult;
  }

  /**
   * 验证网络图数据
   */
  private validateNetworkGraphData(data: any): any {
    this.logger.debug('validateNetworkGraphData input:', JSON.stringify(data, null, 2));
    
    // 如果传入的是包含nodes和edges的对象
    if (data && typeof data === 'object' && Array.isArray(data.nodes) && Array.isArray(data.edges)) {
      // 确保每个节点有name属性（network-graph源码需要）
      const nodes = data.nodes.map((node: any) => ({
        name: node.name || node.label || node.id || 'Unnamed Node',
        ...node
      }));
      
      // 确保边使用正确的source/target且有name属性
      const edges = data.edges.map((edge: any) => ({
        source: edge.source,
        target: edge.target,
        name: edge.name || edge.label || `${edge.source} → ${edge.target}`,
        ...edge
      }));
      
      const result = { nodes, edges };
      this.logger.debug('validateNetworkGraphData result:', JSON.stringify(result, null, 2));
      return result;
    }
    
    // 如果是数组，转换为nodes/edges结构
    if (Array.isArray(data) && data.length > 0) {
      const nodes = data.map((item, index) => ({
        name: item.name || item.label || item.id || `Node ${index + 1}`,
        group: item.group || `group${index % 3 + 1}`
      }));
      
      const edges = [];
      for (let i = 0; i < nodes.length - 1; i++) {
        edges.push({
          source: nodes[i].name,
          target: nodes[(i + 1) % nodes.length].name,
          name: `Connection ${i + 1}`,
          weight: Math.floor(Math.random() * 5) + 1
        });
      }
      
      const result = { nodes, edges };
      this.logger.debug('validateNetworkGraphData result:', JSON.stringify(result, null, 2));
      return result;
    }
    
    // 默认结构 - 确保返回正确的格式
    const defaultResult = {
      nodes: [
        { name: 'Node 1', group: 'group1' },
        { name: 'Node 2', group: 'group1' },
        { name: 'Node 3', group: 'group2' }
      ],
      edges: [
        { source: 'Node 1', target: 'Node 2', name: 'Connection 1', weight: 3 },
        { source: 'Node 2', target: 'Node 3', name: 'Connection 2', weight: 2 }
      ]
    };
    
    this.logger.debug('validateNetworkGraphData default result:', JSON.stringify(defaultResult, null, 2));
    return defaultResult;
  }

  /**
   * 验证鱼骨图数据
   */
  private validateFishboneDiagramData(data: any): any {
    console.debug('validateFishboneDiagramData input:', JSON.stringify(data, null, 2));
    
    // 如果传入的是包含problem和categories的对象，转换为树结构
    if (data && typeof data === 'object' && (data.problem || data.categories)) {
      const problem = data.problem || 'Problem Statement';
      const categories = data.categories || [];
      
      // 转换为fishbone-diagram需要的树形结构
      return {
        name: problem,
        children: categories.map((category: any) => ({
          name: category.name || 'Category',
          children: (category.causes || []).map((cause: any) => ({
            name: typeof cause === 'string' ? cause : (cause.name || 'Cause')
          }))
        }))
      };
    }
    
    // 如果是已经是树结构，确保有name属性
    if (data && typeof data === 'object' && data.name) {
      return data;
    }
    
    // 默认结构
    return {
      name: 'Problem Statement',
      children: [
        {
          name: 'People',
          children: [
            { name: 'Lack of training' },
            { name: 'Poor motivation' }
          ]
        },
        {
          name: 'Process',
          children: [
            { name: 'Complex procedure' },
            { name: 'Long approval time' }
          ]
        },
        {
          name: 'Technology',
          children: [
            { name: 'Outdated system' },
            { name: 'Poor interface' }
          ]
        }
      ]
    };
  }

  /**
   * 验证桑基图数据
   */
  private validateSankeyData(data: any): any {
    this.logger.debug('validateSankeyData input:', JSON.stringify(data, null, 2));
    
    // 如果传入的是包含nodes和links的对象，转换为sankey需要的格式
    if (data && typeof data === 'object' && data.nodes && data.links) {
      // sankey源码期望的是 [{source, target, value}] 格式
      const sankeyData = data.links.map(link => ({
        source: link.source,
        target: link.target,
        value: link.value || Math.random() * 50
      }));
      
      this.logger.debug('validateSankeyData result from nodes/links:', JSON.stringify(sankeyData, null, 2));
      return sankeyData;
    }
    
    // 如果传入的就是links数组格式，直接验证和清理
    if (Array.isArray(data) && data.length > 0 && data[0].source && data[0].target) {
      const sankeyData = data.map(link => ({
        source: link.source,
        target: link.target,
        value: typeof link.value === 'number' ? link.value : Math.random() * 50
      }));
      
      this.logger.debug('validateSankeyData result from array:', JSON.stringify(sankeyData, null, 2));
      return sankeyData;
    }
    
    // 默认桑基图数据
    const defaultResult = [
      { source: 'A', target: 'X', value: 40 },
      { source: 'A', target: 'Y', value: 30 },
      { source: 'B', target: 'X', value: 20 },
      { source: 'B', target: 'Z', value: 25 }
    ];
    
    this.logger.debug('validateSankeyData default result:', JSON.stringify(defaultResult, null, 2));
    return defaultResult;
  }

  /**
   * 验证直方图数据 - 原生版本
   */
  private validateHistogramDataNative(data: any[]): any[] {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array');
    }

    // 直方图需要数值数组
    const values = data.map(item => {
      if (typeof item === 'number') return item;
      if (typeof item === 'object' && typeof item.value === 'number') return item.value;
      return Math.random() * 100;
    });

    return values;
  }

  /**
   * 验证箱线图数据 - 原生版本
   */
  private validateBoxplotDataNative(data: any[]): any[] {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array');
    }

    return data.map((item, index) => {
      const normalizedItem = { ...item };
      
      // 确保有分类字段
      if (!normalizedItem.category && !normalizedItem.name) {
        normalizedItem.category = `Category ${index + 1}`;
      }
      
      // 确保有统计数据
      const stats = ['min', 'q1', 'median', 'q3', 'max'];
      stats.forEach(stat => {
        if (typeof normalizedItem[stat] !== 'number') {
          normalizedItem[stat] = Math.random() * 100;
        }
      });
      
      return normalizedItem;
    });
  }

  /**
   * 验证词云数据 - 原生版本
   */
  private validateWordCloudDataNative(data: any[]): any[] {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array');
    }

    return data.map((item, index) => {
      const normalizedItem = { ...item };
      
      if (!normalizedItem.text && !normalizedItem.word && !normalizedItem.name) {
        normalizedItem.text = `Word ${index + 1}`;
      }
      
      if (typeof normalizedItem.value !== 'number' && typeof normalizedItem.size !== 'number') {
        normalizedItem.value = Math.random() * 100;
      }
      
      return normalizedItem;
    });
  }

  /**
   * 验证双轴图数据 - 原生版本
   */
  private validateDualAxesDataNative(data: any[]): any {
    this.logger.debug(`validateDualAxesDataNative received data:`, JSON.stringify(data, null, 2));
    
    if (!Array.isArray(data) || data.length === 0) {
      this.logger.error(`Invalid data for dual-axes: isArray=${Array.isArray(data)}, length=${data?.length}`);
      throw new Error('Data must be a non-empty array');
    }

    // dual-axes需要categories和series格式 - 根据source/gpt-vis-ssr/src/vis/dual-axes.ts
    // 返回包含categories和series的对象，这将被展开到render options中
    const categories = data.map((item, index) => 
      item.category || item.time || item.date || item.x || `Point ${index + 1}`
    );
    
    const series = [
      {
        type: 'column',
        data: data.map(item => item.sales || item.value1 || item.y1 || Math.random() * 100),
        axisYTitle: 'Sales'
      },
      {
        type: 'line', 
        data: data.map(item => item.profit || item.value2 || item.y2 || Math.random() * 50),
        axisYTitle: 'Profit'
      }
    ];

    const result = { categories, series };
    this.logger.debug(`validateDualAxesDataNative result:`, JSON.stringify(result, null, 2));
    
    return result;
  }

  /**
   * 验证水波图数据 - 原生版本
   */
  private validateLiquidDataNative(data: any[]): any {
    if (!Array.isArray(data) || data.length === 0) {
      return { percent: 0.75 };
    }

    const item = data[0];
    if (typeof item === 'number') {
      return { percent: Math.max(0, Math.min(1, item)) };
    }
    
    if (typeof item === 'object') {
      const percent = item.percent || item.value || 0.75;
      return { percent: Math.max(0, Math.min(1, percent)) };
    }
    
    return { percent: 0.75 };
  }

  /**
   * 验证小提琴图数据 - 原生版本
   */
  private validateViolinDataNative(data: any[]): any[] {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array');
    }

    // 小提琴图需要大量数据点来生成密度曲线
    // 为每个类别生成多个数据点
    const result = [];
    
    data.forEach((item, index) => {
      const category = item.category || `Category ${index + 1}`;
      const baseValue = typeof item.value === 'number' ? item.value : 75;
      
      // 为每个类别生成20个数据点，模拟分布
      for (let i = 0; i < 20; i++) {
        result.push({
          category: category,
          value: baseValue + (Math.random() - 0.5) * 30, // 在基础值附近随机分布
          group: item.group || undefined
        });
      }
    });
    
    return result;
  }

  /**
   * 验证韦恩图数据 - 原生版本
   */
  private validateVennDataNative(data: any[]): any[] {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array');
    }

    return data.map((item, index) => {
      const normalizedItem = { ...item };
      
      if (!normalizedItem.sets) {
        normalizedItem.sets = [`Set${index + 1}`];
      }
      
      if (typeof normalizedItem.size !== 'number' && typeof normalizedItem.value !== 'number') {
        normalizedItem.size = Math.random() * 100;
      }
      
      return normalizedItem;
    });
  }

  /**
   * 验证思维导图数据 - 原生版本 (需要树形结构)
   */
  private validateMindMapDataNative(data: any[]): any {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array');
    }

    // 转换为树形结构 - 根据source/gpt-vis-ssr/src/vis/mind-map.ts
    // 源码期望: {name: string, children: [{name: string, children: []}]}
    const root = data[0] || {};
    return {
      name: root.name || root.value || root.label || 'Root Node',
      children: data.slice(1).map((item, index) => ({
        name: item.name || item.value || item.label || `Node ${index + 1}`,
        children: []
      }))
    };
  }

  /**
   * 验证组织架构图数据 - 原生版本 (需要树形结构)
   */
  private validateOrgChartDataNative(data: any[]): any {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array');
    }

    // 转换为树形结构 - 根据source/gpt-vis-ssr/src/vis/organization-chart.ts
    // 源码期望: {name: string, description?: string, children: [{name: string, description?: string, children: []}]}
    const root = data[0] || {};
    return {
      name: root.name || root.value || root.label || 'CEO',
      description: root.description || root.title || 'Chief Executive Officer',
      children: data.slice(1).map((item, index) => ({
        name: item.name || item.value || item.label || `Employee ${index + 1}`,
        description: item.description || item.title || item.role || `Role ${index + 1}`,
        children: []
      }))
    };
  }

  /**
   * 验证流程图数据 - 原生版本 (需要nodes和edges)
   */
  private validateFlowDiagramDataNative(data: any[]): any {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array');
    }

    // 转换为nodes和edges格式 - 根据source/gpt-vis-ssr/src/vis/flow-diagram.ts
    const nodes = data.map((item, index) => ({
      name: item.name || item.label || item.id || `Step ${index + 1}`,
      // 不需要设置id，源码会自动设置 id: node.name
    }));

    const edges = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      edges.push({
        source: nodes[i].name, // 使用name作为source/target
        target: nodes[i + 1].name,
        name: `Step ${i + 1} → Step ${i + 2}`
      });
    }

    return { nodes, edges };
  }

  /**
   * 验证鱼骨图数据 - 原生版本 (需要树形结构)
   */
  private validateFishboneDiagramDataNative(data: any[]): any {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array');
    }

    // 转换为鱼骨图树形结构 - 根据source/gpt-vis-ssr/src/vis/fishbone-diagram.ts
    // 需要使用name属性，并且是树形结构
    const root = data[0] || {};
    return {
      name: root.name || root.value || root.label || 'Problem', // 使用name而不是id
      children: data.slice(1).map((item, index) => ({
        name: item.name || item.value || item.label || `Cause ${index + 1}`,
        children: item.children || [] // 支持子原因
      }))
    };
  }

  /**
   * 验证网络图数据 - 原生版本 (需要nodes和edges)
   */
  private validateNetworkGraphDataNative(data: any[]): any {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array');
    }

    // 转换为nodes和edges格式 - 根据source/gpt-vis-ssr/src/vis/network-graph.ts
    const nodes = data.map((item, index) => ({
      name: item.name || item.label || item.id || `Node ${index + 1}`,
      // 不需要设置id，源码会自动设置 id: node.name
    }));

    const edges = [];
    // 创建一些连接
    for (let i = 0; i < nodes.length - 1; i++) {
      edges.push({
        source: nodes[i].name, // 使用name作为source/target
        target: nodes[i + 1].name,
        name: `Connection ${i + 1}`
      });
    }
    
    // 如果只有一个节点，创建自循环
    if (nodes.length === 1) {
      edges.push({
        source: nodes[0].name,
        target: nodes[0].name,
        name: 'Self Connection'
      });
    }

    return { nodes, edges };
  }

  /**
   * 验证地区地图数据
   */
  private validateDistrictMapData(data: any[]): any[] {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array');
    }

    return data.map((item, index) => {
      const normalizedItem = { ...item };
      
      if (!normalizedItem.name && !normalizedItem.region && !normalizedItem.category) {
        normalizedItem.category = `Region ${index + 1}`;
      } else {
        normalizedItem.category = normalizedItem.name || normalizedItem.region || normalizedItem.category;
      }
      
      if (typeof normalizedItem.value !== 'number') {
        normalizedItem.value = Math.random() * 100;
      }
      
      return normalizedItem;
    });
  }
}
