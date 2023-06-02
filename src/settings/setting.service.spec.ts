import { Test } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';

import { SettingService } from './setting.service';
import { SettingRepository } from './setting.repository';
import { Setting } from './setting.entity';

describe('SettingService', () => {
  let settingService: SettingService;
  let settingRepository: DeepMocked<SettingRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: SettingRepository,
          useValue: createMock<SettingRepository>(),
        },
        SettingService,
      ],
    }).compile();

    settingService = moduleRef.get(SettingService);
    settingRepository = moduleRef.get(SettingRepository);
  });

  describe('get', () => {
    it('should return a setting', async () => {
      const setting: Setting = 'setting';

      settingRepository.get.mockResolvedValue(setting);

      expect(await settingService.get('key')).toEqual(setting);

      expect(settingRepository.get).toBeCalledWith('key');
    });
  });

  describe('set', () => {
    it('should return updated setting', async () => {
      const setting: Setting = 'setting';

      settingRepository.set.mockResolvedValue(setting);

      expect(await settingService.set('key', setting)).toEqual(setting);

      expect(settingRepository.set).toBeCalledWith('key', setting);
    });
  });
});
