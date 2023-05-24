import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';

import {
  LoggerErrorInterceptor,
  LoggerModule as PinoLoggerModule,
} from 'nestjs-pino';

import { LoggerService } from './logger.service';
import config from './logger.config';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule.forFeature(config)],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const version = config.getOrThrow('version');
        return {
          pinoHttp: {
            level: config.getOrThrow('level'),
            mixin: () => ({
              version,
            }),
          },
        };
      },
    }),
  ],
  providers: [
    LoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerErrorInterceptor,
    },
  ],
  exports: [LoggerService],
})
export class LoggerModule {}
