import { Test, TestingModule } from '@nestjs/testing';

import { INestApplication, VersioningType } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { getQueueToken } from '@nestjs/bull';

import * as request from 'supertest';
import { PinoLogger } from 'nestjs-pino';
import { Queue } from 'bull';

import { AppModule } from 'src/app.module';

describe('JobsController (e2e)', () => {
  let app: INestApplication;
  let queue: Queue;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    app.enableVersioning({
      type: VersioningType.URI,
    });

    queue = await app.get(getQueueToken('jobs'));

    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    PinoLogger.root.level = 'silent';
  });

  beforeEach(async () => {
    await Promise.all([
      queue.clean(0, 'active'),
      queue.clean(0, 'completed'),
      queue.clean(0, 'delayed'),
      queue.clean(0, 'failed'),
      queue.clean(0, 'paused'),
      queue.clean(0, 'wait'),
    ]);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /v1/jobs', () => {
    it('should return a job id', async () => {
      await request(app.getHttpServer())
        .post('/v1/jobs')
        .send({
          operation: 'add',
          data: [2, 4, 6],
        })
        .expect(201)
        .expect((res) =>
          expect(res.body).toEqual({
            id: expect.any(String),
          }),
        );
    });

    it('should error on invalid job', async () => {
      await request(app.getHttpServer())
        .post('/v1/jobs')
        .send({
          operation: 'unknown',
          data: [],
        })
        .expect(400);
    });
  });
});
