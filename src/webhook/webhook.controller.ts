import { Controller, Post, Body, Logger } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookEventDto } from './dto/webhook-event.dto';

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  receiveEvent(@Body() event: WebhookEventDto) {
    this.logger.log(`Incoming webhook: ${event.eventType}`);
    return this.webhookService.handleEvent(event);
  }
}
