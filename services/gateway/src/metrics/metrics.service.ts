import { Injectable } from '@nestjs/common';
import * as promClient from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly registry: promClient.Registry;

  constructor() {
    this.registry = new promClient.Registry();

    promClient.collectDefaultMetrics({
      register: this.registry,
      prefix: 'logiflow_gateway_',
    });
  }

  getContentType(): string {
    return this.registry.contentType;
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
