import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  it('/api/v1/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/health')
      .expect(200)
      .then((res) => {
        expect(res.body.status).toBe('ok');
        expect(res.body.service).toBe('logiflow-core-backend');
      });
  });

  describe('Webhook (e2e)', () => {
    const validPayload = {
      eventType: 'traffic_jam',
      vehicles: [{ id: 'v1', lat: 4.711, lng: -74.0721, capacity: 100 }],
      stops: [{ id: 's1', lat: 4.6097, lng: -74.0817, demand: 20 }],
    };

    it('/api/v1/webhook (POST) should accept valid event', () => {
      return request(app.getHttpServer())
        .post('/api/v1/webhook')
        .send(validPayload)
        .expect(201)
        .then((res) => {
          expect(res.body.received).toBe(true);
          expect(res.body.eventType).toBe('traffic_jam');
          expect(res.body.vehicleCount).toBe(1);
          expect(res.body.stopCount).toBe(1);
        });
    });

    it('/api/v1/webhook (POST) should reject invalid eventType', () => {
      return request(app.getHttpServer())
        .post('/api/v1/webhook')
        .send({ ...validPayload, eventType: 'invalid_event' })
        .expect(400);
    });

    it('/api/v1/webhook (POST) should reject empty vehicles', () => {
      return request(app.getHttpServer())
        .post('/api/v1/webhook')
        .send({ ...validPayload, vehicles: [] })
        .expect(400);
    });

    it('/api/v1/webhook (POST) should reject missing body', () => {
      return request(app.getHttpServer())
        .post('/api/v1/webhook')
        .send({})
        .expect(400);
    });
  });
});
