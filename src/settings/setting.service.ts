import { Injectable } from '@nestjs/common';

import { Setting } from './setting.entity';
import { SettingRepository } from './setting.repository';

@Injectable()
export class SettingService {
  constructor(private readonly settings: SettingRepository) {}

  async get(key: string) {
    return await this.settings.get(key);
  }

  async set(key: string, value: Setting) {
    return await this.settings.set(key, value);
  }
}
