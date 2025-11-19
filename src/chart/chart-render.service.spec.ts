import { Test, TestingModule } from '@nestjs/testing';
import { ChartRenderService } from './chart-render.service';
import { MinioService } from '../minio/minio.service';
import { ConfigService } from '@nestjs/config';
import { render } from '@antv/gpt-vis-ssr';

// Mock @antv/gpt-vis-ssr
jest.mock('@antv/gpt-vis-ssr', () => ({
    render: jest.fn().mockResolvedValue({
        toBuffer: jest.fn().mockReturnValue(Buffer.from('mock-image')),
    }),
}));

describe('ChartRenderService', () => {
    let service: ChartRenderService;
    let minioService: MinioService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ChartRenderService,
                {
                    provide: MinioService,
                    useValue: {
                        createBucket: jest.fn(),
                        getClient: jest.fn().mockReturnValue({
                            putObject: jest.fn().mockResolvedValue({}),
                        }),
                        getPublicUrl: jest.fn().mockResolvedValue('http://localhost:9000/charts/test.png'),
                        getExternalPresignedUrl: jest.fn(),
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
        minioService = module.get<MinioService>(MinioService);
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
});
