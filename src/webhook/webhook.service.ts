import { Injectable, Logger } from '@nestjs/common';
import { WebhookEventDto } from './dto/webhook-event.dto';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  handleEvent(event: WebhookEventDto) {
    this.logger.log(
      `Received event: ${event.eventType} | vehicles: ${event.vehicles.length} | stops: ${event.stops.length}`,
    );

    // TODO #139: Forward to gRPC optimizer service (Cristian's microservice)
    // TODO #140: Forward optimized result to Socket.io gateway (Elizabeth's service)

    return {
      received: true,
      eventType: event.eventType,
      vehicleCount: event.vehicles.length,
      stopCount: event.stops.length,
      timestamp: new Date().toISOString(),
    };
  }
}
