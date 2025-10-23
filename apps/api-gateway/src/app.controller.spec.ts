/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './app.module';

let app: INestApplication;
let appController: AppController;

describe('AppController', () => {
  beforeAll(() => {
    process.env.LOG_LEVEL = 'info';
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
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
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should throttle requests', async () => {
    const url = '/api';

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
