import { Module } from '@nestjs/common';
import {
  APP_FILTER,
  APP_INTERCEPTOR,
  APP_PIPE,
  HttpAdapterHost,
  RouterModule,
} from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';

import { AppController } from './app.controller';
import appConfig from './app.config';

import { LoggerModule } from 'nestjs-pino';
import loggerConfig, { Config as LoggerConfig } from './logger/logger.config';

import { PrismaClientExceptionFilter, PrismaModule } from 'nestjs-prisma';
import dbConfig, { Config as DbConfig } from './db/db.config';

import { TodoModule } from './todos/todo.module';

@Module({
  imports: [
    ConfigModule.forFeature(appConfig),
    LoggerModule.forRootAsync({
      imports: [ConfigModule.forFeature(loggerConfig)],
      inject: [ConfigService],
      useFactory: async (config: ConfigService<LoggerConfig>) => ({
        pinoHttp: {
          level: config.getOrThrow('level'),
          name: config.getOrThrow('version'),
        },
      }),
    }),
    PrismaModule.forRootAsync({
      imports: [ConfigModule.forFeature(dbConfig)],
      inject: [ConfigService],
      useFactory: async (config: ConfigService<DbConfig>) => ({
        prismaOptions: {
          datasources: {
            db: { url: config.getOrThrow('connectionString') },
          },
        },
      }),
    }),
    TodoModule,
    RouterModule.register([{ path: 'todos', module: TodoModule }]),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useFactory: ({ httpAdapter }: HttpAdapterHost) => {
        return new PrismaClientExceptionFilter(httpAdapter);
      },
      inject: [HttpAdapterHost],
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
  ],
  controllers: [AppController],
})
export class AppModule {}
