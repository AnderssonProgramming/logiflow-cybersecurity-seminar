import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MetricsService } from './metrics/metrics.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: MetricsService,
          useValue: {
            getContentType: jest.fn(() => 'text/plain'),
            getMetrics: jest.fn(() => Promise.resolve('# mock metrics')),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('should return health status with service name', () => {
      const result = appController.getHealth();
      expect(result.status).toBe('ok');
      expect(result.service).toBe('logiflow-core-backend');
      expect(result.timestamp).toBeDefined();
    });
  });
});
