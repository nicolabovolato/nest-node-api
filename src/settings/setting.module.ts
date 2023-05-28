import { Module } from '@nestjs/common';

import { CacheModule } from 'src/cache/cache.module';

import { SettingController } from './setting.controller';
import { SettingService } from './setting.service';
import { SettingRepository } from './setting.repository';

@Module({
  imports: [CacheModule],
  controllers: [SettingController],
  providers: [SettingRepository, SettingService],
})
export class SettingModule {}
