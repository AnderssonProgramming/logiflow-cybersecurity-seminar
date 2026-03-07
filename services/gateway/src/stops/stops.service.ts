import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateStopDto } from './dto/create-stop.dto';
import { UpdateStopDto } from './dto/update-stop.dto';

export interface StopEntity {
  id: string;
  lat: number;
  lng: number;
  demand: number;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class StopsService {
  private readonly stops = new Map<string, StopEntity>();

  findAll(): StopEntity[] {
    return Array.from(this.stops.values());
  }

  findOne(id: string): StopEntity {
    const stop = this.stops.get(id);
    if (!stop) {
      throw new NotFoundException(`Stop "${id}" not found`);
    }
    return stop;
  }

  create(dto: CreateStopDto): StopEntity {
    const now = new Date().toISOString();
    const stop: StopEntity = {
      id: dto.id ?? randomUUID(),
      lat: dto.lat,
      lng: dto.lng,
      demand: dto.demand,
      priority: dto.priority ?? 0,
      createdAt: now,
      updatedAt: now,
    };
    this.stops.set(stop.id, stop);
    return stop;
  }

  update(id: string, dto: UpdateStopDto): StopEntity {
    const stop = this.findOne(id);
    const updated: StopEntity = {
      ...stop,
      ...(dto.lat !== undefined && { lat: dto.lat }),
      ...(dto.lng !== undefined && { lng: dto.lng }),
      ...(dto.demand !== undefined && { demand: dto.demand }),
      ...(dto.priority !== undefined && { priority: dto.priority }),
      updatedAt: new Date().toISOString(),
    };
    this.stops.set(id, updated);
    return updated;
  }

  remove(id: string): void {
    if (!this.stops.has(id)) {
      throw new NotFoundException(`Stop "${id}" not found`);
    }
    this.stops.delete(id);
  }
}
