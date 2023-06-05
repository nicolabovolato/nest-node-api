import { Module } from '@nestjs/common';
import { APP_FILTER, HttpAdapterHost } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { PrismaClientExceptionFilter, PrismaModule } from 'nestjs-prisma';

import config, { Config } from './db.config';

@Module({
  imports: [
    PrismaModule.forRootAsync({
      imports: [ConfigModule.forFeature(config)],
      inject: [config.KEY],
      useFactory: (config: Config) => ({
        prismaOptions: {
          datasources: {
            db: {
              url: config.connectionString,
            },
          },
        },
      }),
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useFactory: ({ httpAdapter }: HttpAdapterHost) => {
        return new PrismaClientExceptionFilter(httpAdapter);
      },
      inject: [HttpAdapterHost],
    },
  ],
  exports: [PrismaModule],
})
export class DatabaseModule {}
