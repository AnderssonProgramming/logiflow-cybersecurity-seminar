import { Test, TestingModule } from '@nestjs/testing';
import { StopsService } from './stops.service';
import { NotFoundException } from '@nestjs/common';

describe('StopsService', () => {
  let service: StopsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StopsService],
    }).compile();

    service = module.get<StopsService>(StopsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a stop with auto-generated id', () => {
      const stop = service.create({ lat: 4.609, lng: -74.081, demand: 20 });

      expect(stop.id).toBeDefined();
      expect(stop.lat).toBe(4.609);
      expect(stop.lng).toBe(-74.081);
      expect(stop.demand).toBe(20);
      expect(stop.priority).toBe(0);
      expect(stop.createdAt).toBeDefined();
    });

    it('should create a stop with custom id and priority', () => {
      const stop = service.create({ id: 's1', lat: 4.609, lng: -74.081, demand: 20, priority: 5 });

      expect(stop.id).toBe('s1');
      expect(stop.priority).toBe(5);
    });
  });

  describe('findAll', () => {
    it('should return empty array initially', () => {
      expect(service.findAll()).toEqual([]);
    });

    it('should return all created stops', () => {
      service.create({ lat: 4.609, lng: -74.081, demand: 20 });
      service.create({ lat: 4.710, lng: -74.070, demand: 30 });

      expect(service.findAll()).toHaveLength(2);
    });
  });

  describe('findOne', () => {
    it('should return a stop by id', () => {
      const created = service.create({ id: 's1', lat: 4.609, lng: -74.081, demand: 20 });
      const found = service.findOne('s1');

      expect(found).toEqual(created);
    });

    it('should throw NotFoundException for unknown id', () => {
      expect(() => service.findOne('unknown')).toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update stop fields', () => {
      service.create({ id: 's1', lat: 4.609, lng: -74.081, demand: 20 });

      const updated = service.update('s1', { demand: 50, priority: 3 });

      expect(updated.demand).toBe(50);
      expect(updated.priority).toBe(3);
      expect(updated.lat).toBe(4.609); // unchanged
    });

    it('should throw NotFoundException for unknown id', () => {
      expect(() => service.update('unknown', { demand: 10 })).toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a stop', () => {
      service.create({ id: 's1', lat: 4.609, lng: -74.081, demand: 20 });

      service.remove('s1');

      expect(service.findAll()).toHaveLength(0);
    });

    it('should throw NotFoundException for unknown id', () => {
      expect(() => service.remove('unknown')).toThrow(NotFoundException);
    });
  });
});
