import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesService } from './vehicles.service';
import { NotFoundException } from '@nestjs/common';

describe('VehiclesService', () => {
  let service: VehiclesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehiclesService],
    }).compile();

    service = module.get<VehiclesService>(VehiclesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a vehicle with auto-generated id', () => {
      const vehicle = service.create({
        lat: 4.711,
        lng: -74.072,
        capacity: 100,
      });

      expect(vehicle.id).toBeDefined();
      expect(vehicle.lat).toBe(4.711);
      expect(vehicle.lng).toBe(-74.072);
      expect(vehicle.capacity).toBe(100);
      expect(vehicle.createdAt).toBeDefined();
      expect(vehicle.updatedAt).toBeDefined();
    });

    it('should create a vehicle with custom id', () => {
      const vehicle = service.create({
        id: 'v1',
        lat: 4.711,
        lng: -74.072,
        capacity: 50,
      });

      expect(vehicle.id).toBe('v1');
    });
  });

  describe('findAll', () => {
    it('should return empty array initially', () => {
      expect(service.findAll()).toEqual([]);
    });

    it('should return all created vehicles', () => {
      service.create({ lat: 4.711, lng: -74.072, capacity: 100 });
      service.create({ lat: 4.612, lng: -74.081, capacity: 200 });

      const vehicles = service.findAll();
      expect(vehicles).toHaveLength(2);
    });
  });

  describe('findOne', () => {
    it('should return a vehicle by id', () => {
      const created = service.create({
        id: 'v1',
        lat: 4.711,
        lng: -74.072,
        capacity: 100,
      });
      const found = service.findOne('v1');

      expect(found).toEqual(created);
    });

    it('should throw NotFoundException for unknown id', () => {
      expect(() => service.findOne('unknown')).toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update vehicle fields', () => {
      service.create({ id: 'v1', lat: 4.711, lng: -74.072, capacity: 100 });

      const updated = service.update('v1', { lat: 5.0, capacity: 150 });

      expect(updated.lat).toBe(5.0);
      expect(updated.lng).toBe(-74.072); // unchanged
      expect(updated.capacity).toBe(150);
    });

    it('should throw NotFoundException for unknown id', () => {
      expect(() => service.update('unknown', { lat: 5.0 })).toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a vehicle', () => {
      service.create({ id: 'v1', lat: 4.711, lng: -74.072, capacity: 100 });

      service.remove('v1');

      expect(service.findAll()).toHaveLength(0);
    });

    it('should throw NotFoundException for unknown id', () => {
      expect(() => service.remove('unknown')).toThrow(NotFoundException);
    });
  });
});
