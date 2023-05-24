import { Module } from '@nestjs/common';
import { APP_FILTER, HttpAdapterHost } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { PrismaClientExceptionFilter } from 'nestjs-prisma';

import { DatabaseService } from './db.service';
import config from './db.config';

@Module({
  imports: [ConfigModule.forFeature(config)],
  providers: [
    DatabaseService,
    {
      provide: APP_FILTER,
      useFactory: ({ httpAdapter }: HttpAdapterHost) => {
        return new PrismaClientExceptionFilter(httpAdapter);
      },
      inject: [HttpAdapterHost],
    },
  ],
  exports: [DatabaseService],
})
export class DatabaseModule {}
