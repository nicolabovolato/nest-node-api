import { Injectable } from '@nestjs/common';

import { CacheService } from 'src/cache/cache.service';

import { Setting } from './setting.entity';

@Injectable()
export class SettingRepository {
  private readonly prefix = 'settings:';
  constructor(private readonly cache: CacheService) {}

  async get(key: string) {
    return await this.cache.get(this.prefix + key);
  }

  async set(key: string, value: Setting) {
    if (value) await this.cache.set(this.prefix + key, value);
    else await this.cache.del(this.prefix + key);

    return value;
  }
}
