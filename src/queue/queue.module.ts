import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';

import config, { Config } from './queue.config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule.forFeature(config)],
      inject: [config.KEY],
      useFactory: (config: Config) => ({
        url: config.connectionString,
        redis: {
          commandTimeout: config.timeoutMs,
          reconnectOnError: () => true,
          retryStrategy: () => config.timeoutMs,
        },
      }),
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
