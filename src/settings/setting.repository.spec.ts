import { Test } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';

import { CacheService } from 'src/cache/cache.service';

import { SettingRepository } from './setting.repository';
import { Setting } from './setting.entity';

describe('SettingRepository', () => {
  let settingRepository: SettingRepository;
  let cacheService: DeepMocked<CacheService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: CacheService,
          useValue: createMock<CacheService>(),
        },
        SettingRepository,
      ],
    }).compile();

    settingRepository = moduleRef.get(SettingRepository);
    cacheService = moduleRef.get(CacheService);
  });

  describe('get', () => {
    it('should return a setting', async () => {
      const setting: Setting = 'setting';

      cacheService.get.mockResolvedValue(setting);

      expect(await settingRepository.get('key')).toEqual(setting);

      expect(cacheService.get).toBeCalledWith('settings:key');
    });
  });

  describe('set', () => {
    it('should return updated setting', async () => {
      const setting: Setting = 'setting';

      expect(await settingRepository.set('key', setting)).toEqual(setting);

      expect(cacheService.set).toBeCalledWith('settings:key', setting);
    });

    it('should return deleted setting', async () => {
      const setting: Setting = null;

      expect(await settingRepository.set('key', setting)).toEqual(setting);

      expect(cacheService.del).toBeCalledWith('settings:key');
    });
  });
});
