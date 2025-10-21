/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { INestApplication } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import * as request from 'supertest';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
          ThrottlerModule.forRoot({
            throttlers: [
              {
                ttl: 1000,
                limit: 10,
              },
            ],
          }),
        ],
        controllers: [AppController],
        providers: [
          AppService,
          {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
          },
        ],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
    });

    it('should throttle requests', async () => {
      const url = '/';

      for (let i = 0; i < 10; i++) {
        await request(app.getHttpServer()).get(url).expect(200);
      }

      await request(app.getHttpServer()).get(url).expect(429);
    });

    afterAll(async () => {
      await app.close();
    });
  });
});
