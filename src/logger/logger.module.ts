import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import {
  LoggerErrorInterceptor,
  LoggerModule as PinoLoggerModule,
} from 'nestjs-pino';

import { LoggerService } from './logger.service';
import config, { Config } from './logger.config';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule.forFeature(config)],
      inject: [config.KEY],
      useFactory: async (config: Config) => {
        const version = config.version;
        return {
          pinoHttp: {
            level: config.level,
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
