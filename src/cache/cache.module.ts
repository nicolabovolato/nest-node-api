import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CacheService } from './cache.service';
import config from './cache.config';

@Module({
  imports: [ConfigModule.forFeature(config)],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
