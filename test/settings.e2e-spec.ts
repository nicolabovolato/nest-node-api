import { Test, TestingModule } from '@nestjs/testing';

import { INestApplication, VersioningType } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import * as request from 'supertest';
import { PinoLogger } from 'nestjs-pino';

import { AppModule } from 'src/app.module';
import { CacheService } from 'src/cache/cache.service';

describe('SettingController (e2e)', () => {
  let app: INestApplication;
  let cache: CacheService;

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

    cache = await app.get(CacheService);

    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    PinoLogger.root.level = 'silent';
  });

  beforeEach(async () => {
    await cache.flushdb();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /v1/settings/:id', () => {
    beforeEach(async () => {
      await cache.set('settings:setting-key', 'value');
    });

    it('should return a setting', async () => {
      await request(app.getHttpServer())
        .get('/v1/settings/setting-key')
        .expect(200)
        .expect({
          value: 'value',
        });
    });

    it('should return null on not found', async () => {
      await request(app.getHttpServer())
        .get('/v1/settings/another-setting-key')
        .expect(200)
        .expect({
          value: null,
        });
    });

    it('should error on invalid id', async () => {
      await request(app.getHttpServer()).get('/v1/settings/id').expect(400);
    });
  });

  describe('PUT /v1/settings/:id', () => {
    beforeEach(async () => {
      await cache.set('settings:setting-key', 'value');
    });

    it('should return updated setting', async () => {
      await request(app.getHttpServer())
        .put('/v1/settings/setting-key')
        .send({ value: 'new-value' })
        .expect(200)
        .expect({
          value: 'new-value',
        });
    });

    it('should return deleted setting', async () => {
      await request(app.getHttpServer())
        .put('/v1/settings/setting-key')
        .send({ value: null })
        .expect(200)
        .expect({
          value: null,
        });
    });

    it('should error on invalid id', async () => {
      await request(app.getHttpServer())
        .put('/v1/settings/id')
        .send({ value: 'value' })
        .expect(400);
    });
  });
});
