import { Test, TestingModule } from '@nestjs/testing';
import { StopsController } from './stops.controller';
import { StopsService } from './stops.service';

describe('StopsController', () => {
  let controller: StopsController;
  let service: StopsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StopsController],
      providers: [StopsService],
    }).compile();

    controller = module.get<StopsController>(StopsController);
    service = module.get<StopsService>(StopsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of stops', () => {
      service.create({ id: 's1', lat: 4.609, lng: -74.081, demand: 20 });

      const result = controller.findAll();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('s1');
    });
  });

  describe('findOne', () => {
    it('should return a single stop', () => {
      service.create({ id: 's1', lat: 4.609, lng: -74.081, demand: 20 });

      const result = controller.findOne('s1');
      expect(result.id).toBe('s1');
    });
  });

  describe('create', () => {
    it('should create and return a stop', () => {
      const result = controller.create({
        lat: 4.609,
        lng: -74.081,
        demand: 20,
      });

      expect(result.id).toBeDefined();
      expect(result.demand).toBe(20);
    });
  });

  describe('update', () => {
    it('should update and return the stop', () => {
      service.create({ id: 's1', lat: 4.609, lng: -74.081, demand: 20 });

      const result = controller.update('s1', { demand: 50 });
      expect(result.demand).toBe(50);
    });
  });

  describe('remove', () => {
    it('should remove the stop', () => {
      service.create({ id: 's1', lat: 4.609, lng: -74.081, demand: 20 });

      controller.remove('s1');
      expect(service.findAll()).toHaveLength(0);
    });
  });
});
