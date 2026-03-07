import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

export interface VehicleEntity {
  id: string;
  lat: number;
  lng: number;
  capacity: number;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class VehiclesService {
  private readonly vehicles = new Map<string, VehicleEntity>();

  findAll(): VehicleEntity[] {
    return Array.from(this.vehicles.values());
  }

  findOne(id: string): VehicleEntity {
    const vehicle = this.vehicles.get(id);
    if (!vehicle) {
      throw new NotFoundException(`Vehicle "${id}" not found`);
    }
    return vehicle;
  }

  create(dto: CreateVehicleDto): VehicleEntity {
    const now = new Date().toISOString();
    const vehicle: VehicleEntity = {
      id: dto.id ?? randomUUID(),
      lat: dto.lat,
      lng: dto.lng,
      capacity: dto.capacity,
      createdAt: now,
      updatedAt: now,
    };
    this.vehicles.set(vehicle.id, vehicle);
    return vehicle;
  }

  update(id: string, dto: UpdateVehicleDto): VehicleEntity {
    const vehicle = this.findOne(id);
    const updated: VehicleEntity = {
      ...vehicle,
      ...(dto.lat !== undefined && { lat: dto.lat }),
      ...(dto.lng !== undefined && { lng: dto.lng }),
      ...(dto.capacity !== undefined && { capacity: dto.capacity }),
      updatedAt: new Date().toISOString(),
    };
    this.vehicles.set(id, updated);
    return updated;
  }

  remove(id: string): void {
    if (!this.vehicles.has(id)) {
      throw new NotFoundException(`Vehicle "${id}" not found`);
    }
    this.vehicles.delete(id);
  }
}
