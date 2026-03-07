import { Test, TestingModule } from '@nestjs/testing';
import { ChartRenderService } from './chart-render.service';
import { MinioService } from '../minio/minio.service';
import { ConfigService } from '@nestjs/config';
import { render } from '@antv/gpt-vis-ssr';

// Mock @antv/gpt-vis-ssr
jest.mock('@antv/gpt-vis-ssr', () => ({
  render: jest.fn(),
}));

describe('ChartRenderService', () => {
  let service: ChartRenderService;
  const renderMock = render as jest.Mock;

  beforeEach(async () => {
    renderMock.mockReset();
    renderMock.mockResolvedValue({
      toBuffer: jest.fn().mockReturnValue(Buffer.from('mock-image')),
      destroy: jest.fn(),
    });
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChartRenderService,
        {
          provide: MinioService,
          useValue: {
            ensureBucket: jest.fn().mockResolvedValue(true),
            getClient: jest.fn().mockReturnValue({
              putObject: jest.fn().mockResolvedValue({}),
            }),
            getObjectAccessUrl: jest
              .fn()
              .mockResolvedValue('http://localhost:9000/charts/test.png'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key, defaultValue) => defaultValue),
          },
        },
      ],
    }).compile();

    service = module.get<ChartRenderService>(ChartRenderService);
  });

  it('should adjust width for large datasets', async () => {
    const largeData = Array.from({ length: 50 }, (_, i) => ({
      category: `Item ${i}`,
      value: i,
    }));

    await service.renderChartToUrl({
      type: 'bar',
      data: largeData,
      width: 800,
      height: 600,
    });

    // Default width is 800.
    // 50 items * 60 pixels/item = 3000 pixels.
    // Expect render to be called with width 3000.
    expect(render).toHaveBeenCalledWith(
      expect.objectContaining({
        width: 3000,
      }),
    );
  });

  it('should not adjust width for small datasets', async () => {
    const smallData = Array.from({ length: 5 }, (_, i) => ({
      category: `Item ${i}`,
      value: i,
    }));

    await service.renderChartToUrl({
      type: 'bar',
      data: smallData,
      width: 800,
      height: 600,
    });

    // 5 items * 60 pixels/item = 300 pixels < 800.
    // Expect render to be called with default width 800.
    expect(render).toHaveBeenCalledWith(
      expect.objectContaining({
        width: 800,
      }),
    );
  });

  it('should destroy SSR result after rendering', async () => {
    await service.renderChartToUrl({
      type: 'bar',
      data: [{ category: 'Item 1', value: 1 }],
    });

    const vis = await renderMock.mock.results[0].value;
    expect(vis.destroy).toHaveBeenCalledTimes(1);
  });

  it('should preserve explicit edges in flow diagram flat array input', async () => {
    await service.renderChartToUrl({
      type: 'flow-diagram',
      data: [
        { id: '1', label: 'Start', type: 'start' },
        { id: '2', label: 'End', type: 'end' },
        { from: '1', to: '2', label: 'Approved' },
      ],
    });

    const options = renderMock.mock.calls[0][0];
    expect(options.type).toBe('flow-diagram');
    expect(options.data.edges).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: 'Start',
          target: 'End',
          name: 'Approved',
        }),
      ]),
    );
  });

  it('should preserve explicit edges in network graph flat array input', async () => {
    await service.renderChartToUrl({
      type: 'network-graph',
      data: [
        { id: 'A', label: 'Alice' },
        { id: 'B', label: 'Bob' },
        { source: 'A', target: 'B', weight: 0 },
      ],
    });

    const options = renderMock.mock.calls[0][0];
    expect(options.type).toBe('network-graph');
    expect(options.data.edges).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: 'Alice',
          target: 'Bob',
          weight: 0,
        }),
      ]),
    );
  });

  it('should build organization hierarchy using parent references', async () => {
    await service.renderChartToUrl({
      type: 'organization-chart',
      data: [
        { id: '1', name: 'CEO', parent: null },
        { id: '2', name: 'CTO', parent: '1' },
        { id: '3', name: 'Engineer', parent: '2' },
      ],
    });

    const options = renderMock.mock.calls[0][0];
    expect(options.type).toBe('organization-chart');
    expect(options.data.name).toBe('CEO');
    expect(options.data.children[0].name).toBe('CTO');
    expect(options.data.children[0].children[0].name).toBe('Engineer');
  });

  it('should respect liquid percent from options including zero', async () => {
    await service.renderChartToUrl({
      type: 'liquid',
      percent: 0,
      shape: 'rect',
    } as any);

    const options = renderMock.mock.calls[0][0];
    expect(options.type).toBe('liquid');
    expect(options.percent).toBe(0);
    expect(options.shape).toBe('rect');
  });

  it('should keep zero values in dual-axes data', async () => {
    await service.renderChartToUrl({
      type: 'dual-axes',
      data: [{ time: '2024-01', sales: 0, profit: 0 }],
    });

    const options = renderMock.mock.calls[0][0];
    expect(options.type).toBe('dual-axes');
    expect(options.series[0].data[0]).toBe(0);
    expect(options.series[1].data[0]).toBe(0);
  });

  it('should expose map-related chart types in supported list', () => {
    expect(service.getSupportedChartTypes()).toEqual(
      expect.arrayContaining(['district-map', 'pin-map', 'path-map']),
    );
  });

  it('should initialize bucket on module init when auto-create is enabled', async () => {
    const minioService = (
      service as unknown as {
        minioService: { ensureBucket: jest.Mock };
      }
    ).minioService;

    await service.onModuleInit();

    expect(minioService.ensureBucket).toHaveBeenCalledWith('charts', {
      region: 'us-east-1',
      applyPublicReadPolicy: true,
    });
  });
});
