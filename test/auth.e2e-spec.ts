import { Test, TestingModule } from '@nestjs/testing';

import { INestApplication, VersioningType } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import * as request from 'supertest';
import { PinoLogger } from 'nestjs-pino';

import { AppModule } from 'src/app.module';
import { AuthService } from 'src/auth/auth.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let auth: AuthService;

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

    auth = await app.get(AuthService);

    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    PinoLogger.root.level = 'silent';
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /v1/auth/token', () => {
    it('should return a token', async () => {
      await request(app.getHttpServer())
        .post('/v1/auth/token')
        .send({
          role: 'user',
          sub: 'user@example.com',
        })
        .expect(201)
        .expect((res) =>
          expect(res.body).toEqual({
            token: expect.any(String),
          }),
        );
    });

    it('should error on invalid claims', async () => {
      await request(app.getHttpServer())
        .post('/v1/auth/token')
        .send({ sub: 'user-id', role: 'user-role' })
        .expect(400);
    });
  });

  describe('GET /v1/auth/protected', () => {
    it('should return a message', async () => {
      await request(app.getHttpServer())
        .get('/v1/auth/protected')
        .set(
          'authorization',
          `Bearer ${await auth.sign({
            role: 'user',
            sub: 'user@example.com',
          })}`,
        )
        .expect(200)
        .expect((res) =>
          expect(res.body).toEqual({
            message: expect.any(String),
          }),
        );
    });

    it('should error on unauthorized user', async () => {
      await request(app.getHttpServer()).get('/v1/auth/protected').expect(401);
    });
  });

  describe('GET /v1/auth/user/:email', () => {
    it('should return a message', async () => {
      await request(app.getHttpServer())
        .get('/v1/auth/user/user@example.com')
        .set(
          'authorization',
          `Bearer ${await auth.sign({
            role: 'user',
            sub: 'user@example.com',
          })}`,
        )
        .expect(200)
        .expect((res) =>
          expect(res.body).toEqual({
            message: expect.any(String),
          }),
        );
    });

    it('should error on unauthorized user', async () => {
      await request(app.getHttpServer())
        .get('/v1/auth/user/user@example.com')
        .expect(401);
    });

    it('should error on different sub', async () => {
      await request(app.getHttpServer())
        .get('/v1/auth/user/user@example.com')
        .set(
          'authorization',
          `Bearer ${await auth.sign({
            role: 'user',
            sub: 'user2@example.com',
          })}`,
        )
        .expect(403);
    });
  });

  describe('GET /v1/auth/admin', () => {
    it('should return a message', async () => {
      await request(app.getHttpServer())
        .get('/v1/auth/admin')
        .set(
          'authorization',
          `Bearer ${await auth.sign({
            role: 'admin',
            sub: 'user@example.com',
          })}`,
        )
        .expect(200)
        .expect((res) =>
          expect(res.body).toEqual({
            message: expect.any(String),
          }),
        );
    });

    it('should error on unauthorized user', async () => {
      await request(app.getHttpServer()).get('/v1/auth/admin').expect(401);
    });

    it('should error on different role', async () => {
      await request(app.getHttpServer())
        .get('/v1/auth/admin')
        .set(
          'authorization',
          `Bearer ${await auth.sign({
            role: 'user',
            sub: 'user@example.com',
          })}`,
        )
        .expect(403);
    });
  });
});
