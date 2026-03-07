import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';

describe('VehiclesController', () => {
  let controller: VehiclesController;
  let service: VehiclesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesController],
      providers: [VehiclesService],
    }).compile();

    controller = module.get<VehiclesController>(VehiclesController);
    service = module.get<VehiclesService>(VehiclesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of vehicles', () => {
      service.create({ id: 'v1', lat: 4.711, lng: -74.072, capacity: 100 });

      const result = controller.findAll();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('v1');
    });
  });

  describe('findOne', () => {
    it('should return a single vehicle', () => {
      service.create({ id: 'v1', lat: 4.711, lng: -74.072, capacity: 100 });

      const result = controller.findOne('v1');
      expect(result.id).toBe('v1');
    });
  });

  describe('create', () => {
    it('should create and return a vehicle', () => {
      const result = controller.create({
        lat: 4.711,
        lng: -74.072,
        capacity: 100,
      });

      expect(result.id).toBeDefined();
      expect(result.lat).toBe(4.711);
    });
  });

  describe('update', () => {
    it('should update and return the vehicle', () => {
      service.create({ id: 'v1', lat: 4.711, lng: -74.072, capacity: 100 });

      const result = controller.update('v1', { capacity: 200 });
      expect(result.capacity).toBe(200);
    });
  });

  describe('remove', () => {
    it('should remove the vehicle', () => {
      service.create({ id: 'v1', lat: 4.711, lng: -74.072, capacity: 100 });

      controller.remove('v1');
      expect(service.findAll()).toHaveLength(0);
    });
  });
});
