export interface Vehicle {
  id: string;
  lat: number;
  lng: number;
  capacity: number;
}

export interface Stop {
  id: string;
  lat: number;
  lng: number;
  demand: number;
  priority: number;
}

export interface SolveRouteRequest {
  eventType: string;
  vehicles: Vehicle[];
  stops: Stop[];
}

export interface RouteStep {
  stopId: string;
  lat: number;
  lng: number;
  arrivalOrder: number;
}

export interface VehicleRoute {
  vehicleId: string;
  steps: RouteStep[];
  totalDistance: number;
  estimatedTime: number;
}

export interface SolveRouteResponse {
  routes: VehicleRoute[];
  totalCost: number;
  solvedAt: string;
}

export interface RouteOptimizerGrpcService {
  solveRoute(request: SolveRouteRequest): Promise<SolveRouteResponse>;
}
