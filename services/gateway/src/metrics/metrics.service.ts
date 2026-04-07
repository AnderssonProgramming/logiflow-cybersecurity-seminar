import { Injectable } from '@nestjs/common';
import * as promClient from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly registry: promClient.Registry;
  private readonly dependencyCveGauge: promClient.Gauge;

  constructor() {
    this.registry = promClient.register;

    promClient.collectDefaultMetrics({
      register: this.registry,
      prefix: 'logiflow_gateway_',
    });

    this.dependencyCveGauge = new promClient.Gauge({
      name: 'logiflow_dependency_cve_total',
      help: 'Current number of known CVEs detected in dependency scans',
      registers: [this.registry],
    });

    // Baseline value; can be updated by security jobs or runtime hooks.
    this.dependencyCveGauge.set(0);
  }

  getContentType(): string {
    return this.registry.contentType;
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
