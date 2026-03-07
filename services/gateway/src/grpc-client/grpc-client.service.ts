import { Injectable, Logger, OnModuleInit, Inject } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import {
  RouteOptimizerGrpcService,
  SolveRouteRequest,
  SolveRouteResponse,
} from './interfaces/route-optimizer.interface';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable()
export class GrpcClientService implements OnModuleInit {
  private readonly logger = new Logger(GrpcClientService.name);
  private routeOptimizerService!: RouteOptimizerGrpcService;

  constructor(
    @Inject('ROUTE_OPTIMIZER_PACKAGE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.routeOptimizerService =
      this.client.getService<RouteOptimizerGrpcService>('RouteOptimizer');
    this.logger.log('gRPC RouteOptimizer client initialized');
  }

  async solveRoute(request: SolveRouteRequest): Promise<SolveRouteResponse> {
    this.logger.log(
      `Sending VRP to optimizer: ${request.vehicles.length} vehicles, ${request.stops.length} stops`,
    );

    const result = this.routeOptimizerService.solveRoute(request);

    // gRPC in NestJS returns Observable; convert to Promise
    const response = await firstValueFrom(
      result as unknown as Observable<SolveRouteResponse>,
    );

    this.logger.log(
      `Optimizer returned ${response.routes.length} routes, total cost: ${response.totalCost}`,
    );

    return response;
  }
}
