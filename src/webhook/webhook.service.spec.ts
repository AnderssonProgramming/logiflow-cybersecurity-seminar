import { Test, TestingModule } from '@nestjs/testing';
import { WebhookService } from './webhook.service';

describe('WebhookService', () => {
  let service: WebhookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebhookService],
    }).compile();

    service = module.get<WebhookService>(WebhookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleEvent', () => {
    it('should return confirmation with correct counts', () => {
      const result = service.handleEvent({
        eventType: 'new_order',
        vehicles: [
          { id: 'v1', lat: 4.711, lng: -74.0721, capacity: 100 },
          { id: 'v2', lat: 4.635, lng: -74.083, capacity: 80 },
        ],
        stops: [
          { id: 's1', lat: 4.6097, lng: -74.0817, demand: 20 },
          { id: 's2', lat: 4.658, lng: -74.094, demand: 15 },
          { id: 's3', lat: 4.624, lng: -74.063, demand: 30 },
        ],
      });

      expect(result.received).toBe(true);
      expect(result.eventType).toBe('new_order');
      expect(result.vehicleCount).toBe(2);
      expect(result.stopCount).toBe(3);
      expect(result.timestamp).toBeDefined();
    });
  });
});
