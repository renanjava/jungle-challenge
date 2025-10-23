/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { INestApplication } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import request from 'supertest';
import { LoggerModule } from '@my-monorepo/shared-logger';

let app: INestApplication;
let appController: AppController;

describe('AppController', () => {
  beforeAll(() => {
    process.env.LOG_LEVEL = 'info';
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        LoggerModule.forRoot({
          level: process.env.LOG_LEVEL,
          serviceName: 'API_GATEWAY',
        }),
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  it('should return "Hello World!"', () => {
    expect(appController.getHello()).toBe('Hello World!');
  });
});

describe('AppController (e2e)', () => {
  beforeAll(async () => {
    process.env.LOG_LEVEL = 'info';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot({
          throttlers: [{ ttl: 1000, limit: 10 }],
        }),
        LoggerModule.forRoot({
          level: process.env.LOG_LEVEL,
          serviceName: 'API_GATEWAY',
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
    if (app) {
      await app.close();
    }
  });
});
