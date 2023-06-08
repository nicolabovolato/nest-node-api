import {
  Inject,
  Injectable,
  Logger,
  OnApplicationShutdown,
} from '@nestjs/common';

import config, { Config } from './cache.config';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService extends Redis implements OnApplicationShutdown {
  private readonly logger = new Logger(CacheService.name);

  constructor(
    @Inject(config.KEY)
    config: Config,
  ) {
    super(config.connectionString, {
      commandTimeout: config.timeoutMs,
      reconnectOnError: () => true,
      retryStrategy: () => config.timeoutMs,
    });

    this.on('error', (err) => this.logger.error(err));
  }

  async onApplicationShutdown() {
    await this.quit();
  }
}
