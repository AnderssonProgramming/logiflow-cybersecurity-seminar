import { Controller, Get, Res } from '@nestjs/common';
import { type Response } from 'express';
import { AppService } from './app.service';
import { Public } from './auth/public.decorator';
import { MetricsService } from './metrics/metrics.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly metricsService: MetricsService,
  ) {}

  @Get('health')
  @Public()
  getHealth() {
    return this.appService.getHealth();
  }

  @Get('metrics')
  @Public()
  async getMetrics(@Res() res: Response): Promise<void> {
    res.setHeader('Content-Type', this.metricsService.getContentType());
    res.send(await this.metricsService.getMetrics());
  }
}
