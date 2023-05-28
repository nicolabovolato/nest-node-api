import { INestApplication } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { NestFactory } from '@nestjs/core';

import * as request from 'supertest';
import { PinoLogger } from 'nestjs-pino';

import { AppModule } from 'src/app.module';
import { DatabaseService } from 'src/db/db.service';

describe('TodoController (e2e)', () => {
  let app: INestApplication;
  let db: DatabaseService;

  beforeAll(async () => {
    // I need to create the real app because HttpAdapterHost (required by nestjs-prisma's exception filter) is not resolved in test modules :(
    // https://github.com/nestjs/nest/issues/8076
    app = await NestFactory.create(AppModule, new FastifyAdapter(), {
      logger: false,
    });

    db = await app.get(DatabaseService);

    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    PinoLogger.root.level = 'silent';
  });

  beforeEach(async () => {
    await db.todo.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /v1/todos', () => {
    beforeEach(async () => {
      await db.todo.createMany({
        data: [
          {
            id: '78b8c140-ad78-4bed-9ecb-47f48e5b9e27',
            title: 'todo 1',
            description: 'todo 1',
            completed: false,
            created_at: new Date(2023, 1, 2),
          },
          {
            id: 'adfdc2c3-3cef-4206-8ace-248edffcfbf2',
            title: 'todo 2',
            description: 'todo 2',
            completed: false,
            created_at: new Date(2023, 1, 1),
          },
        ],
      });
    });

    it('should return a list of todos', async () => {
      await request(app.getHttpServer())
        .get('/v1/todos')
        .query({ limit: 10, offset: 0 })
        .expect(200)
        .expect([
          {
            id: '78b8c140-ad78-4bed-9ecb-47f48e5b9e27',
            title: 'todo 1',
            description: 'todo 1',
            completed: false,
          },
          {
            id: 'adfdc2c3-3cef-4206-8ace-248edffcfbf2',
            title: 'todo 2',
            description: 'todo 2',
            completed: false,
          },
        ]);
    });

    it('should error on invalid query', async () => {
      await request(app.getHttpServer())
        .get('/v1/todos')
        .query({ limit: 1, offset: -1 })
        .expect(400);
    });
  });

  describe('GET /v1/todos/:id', () => {
    beforeEach(async () => {
      await db.todo.create({
        data: {
          id: '78b8c140-ad78-4bed-9ecb-47f48e5b9e27',
          title: 'todo 1',
          description: 'todo 1',
          completed: false,
        },
      });
    });

    it('should return a todo', async () => {
      await request(app.getHttpServer())
        .get('/v1/todos/78b8c140-ad78-4bed-9ecb-47f48e5b9e27')
        .expect(200)
        .expect({
          id: '78b8c140-ad78-4bed-9ecb-47f48e5b9e27',
          title: 'todo 1',
          description: 'todo 1',
          completed: false,
        });
    });

    it('should error on invalid id', async () => {
      await request(app.getHttpServer())
        .get('/v1/todos/invalid-id')
        .expect(400);
    });

    it('should error on not found', async () => {
      await request(app.getHttpServer())
        .get('/v1/todos/adfdc2c3-3cef-4206-8ace-248edffcfbf2')
        .expect(404);
    });
  });

  describe('POST /v1/todos', () => {
    it('should create a todo', async () => {
      await request(app.getHttpServer())
        .post('/v1/todos')
        .send({
          title: 'todo 1',
          description: 'todo 1',
          completed: false,
        })
        .expect(201)
        .expect((res) =>
          expect(res.body).toEqual({
            id: expect.any(String),
            title: 'todo 1',
            description: 'todo 1',
            completed: false,
          }),
        );
    });

    it('should error on invalid body', async () => {
      await request(app.getHttpServer()).post('/v1/todos').send({}).expect(400);
    });
  });

  describe('PUT /v1/todos/:id', () => {
    beforeEach(async () => {
      await db.todo.create({
        data: {
          id: '78b8c140-ad78-4bed-9ecb-47f48e5b9e27',
          title: 'todo 1',
          description: 'todo 1',
          completed: false,
        },
      });
    });

    it('should update a todo', async () => {
      await request(app.getHttpServer())
        .put('/v1/todos/78b8c140-ad78-4bed-9ecb-47f48e5b9e27')
        .send({
          title: 'updated title',
          description: 'updated description',
          completed: true,
        })
        .expect(200)
        .expect({
          id: '78b8c140-ad78-4bed-9ecb-47f48e5b9e27',
          title: 'updated title',
          description: 'updated description',
          completed: true,
        });
    });

    it('should error on invalid id', async () => {
      await request(app.getHttpServer())
        .put('/v1/todos/invalid-id')
        .expect(400);
    });

    it('should error on invalid body', async () => {
      await request(app.getHttpServer())
        .put('/v1/todos/78b8c140-ad78-4bed-9ecb-47f48e5b9e27')
        .send({})
        .expect(400);
    });

    it('should error on not found', async () => {
      await request(app.getHttpServer())
        .put('/v1/todos/adfdc2c3-3cef-4206-8ace-248edffcfbf2')
        .send({
          title: 'updated title',
          description: 'updated description',
          completed: true,
        })
        .expect(404);
    });
  });

  describe('DELETE /v1/todos/:id', () => {
    beforeEach(async () => {
      await db.todo.create({
        data: {
          id: '78b8c140-ad78-4bed-9ecb-47f48e5b9e27',
          title: 'todo 1',
          description: 'todo 1',
          completed: false,
        },
      });
    });

    it('should delete a todo', async () => {
      await request(app.getHttpServer())
        .delete('/v1/todos/78b8c140-ad78-4bed-9ecb-47f48e5b9e27')
        .expect(200)
        .expect({
          id: '78b8c140-ad78-4bed-9ecb-47f48e5b9e27',
          title: 'todo 1',
          description: 'todo 1',
          completed: false,
        });
    });

    it('should error on invalid id', async () => {
      await request(app.getHttpServer())
        .delete('/v1/todos/invalid-id')
        .expect(400);
    });

    it('should error on not found', async () => {
      await request(app.getHttpServer())
        .delete('/v1/todos/adfdc2c3-3cef-4206-8ace-248edffcfbf2')
        .expect(404);
    });
  });
});
