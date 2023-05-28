import { Test } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';

import { SettingController } from './setting.controller';
import { SettingService } from './setting.service';
import { Setting } from './setting.entity';

describe('SettingController', () => {
  let settingController: SettingController;
  let settingService: DeepMocked<SettingService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [SettingController],
      providers: [
        {
          provide: SettingService,
          useValue: createMock<SettingService>(),
        },
      ],
    }).compile();

    settingService = moduleRef.get(SettingService);
    settingController = moduleRef.get(SettingController);
  });

  describe('get', () => {
    it('should return a todo', async () => {
      const setting: Setting = 'setting';

      settingService.get.mockResolvedValue(setting);

      expect(await settingController.get({ id: 'key' })).toEqual({
        value: setting,
      });

      expect(settingService.get).toBeCalledWith('key');
    });
  });

  describe('set', () => {
    it('should return updated todo', async () => {
      const setting: Setting = 'setting';

      settingService.set.mockResolvedValue(setting);

      expect(
        await settingController.set({ id: 'key' }, { value: setting }),
      ).toEqual({
        value: setting,
      });

      expect(settingService.set).toBeCalledWith('key', setting);
    });
  });
});
