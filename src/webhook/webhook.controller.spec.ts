import { Test, TestingModule } from '@nestjs/testing';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { WebhookEventDto } from './dto/webhook-event.dto';
import { GrpcClientService } from '../grpc-client/grpc-client.service';

const mockGrpcClientService = {
  solveRoute: jest.fn().mockResolvedValue({
    routes: [],
    totalCost: 0,
    solvedAt: '2026-03-05T00:00:00.000Z',
  }),
};

describe('WebhookController', () => {
  let controller: WebhookController;
  let service: WebhookService;

  const mockEvent: WebhookEventDto = {
    eventType: 'traffic_jam',
    vehicles: [{ id: 'v1', lat: 4.711, lng: -74.0721, capacity: 100 }],
    stops: [{ id: 's1', lat: 4.6097, lng: -74.0817, demand: 20 }],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhookController],
      providers: [
        WebhookService,
        { provide: GrpcClientService, useValue: mockGrpcClientService },
      ],
    }).compile();

    controller = module.get<WebhookController>(WebhookController);
    service = module.get<WebhookService>(WebhookService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('receiveEvent', () => {
    it('should process a valid webhook event and return confirmation', async () => {
      const result = await controller.receiveEvent(mockEvent);

      expect(result.received).toBe(true);
      expect(result.eventType).toBe('traffic_jam');
      expect(result.vehicleCount).toBe(1);
      expect(result.stopCount).toBe(1);
      expect(result.timestamp).toBeDefined();
    });

    it('should call webhookService.handleEvent with the event', async () => {
      const spy = jest.spyOn(service, 'handleEvent');
      await controller.receiveEvent(mockEvent);

      expect(spy).toHaveBeenCalledWith(mockEvent);
    });
  });
});
