import { Test } from '@nestjs/testing';

import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get(AppController);
  });

  describe('healthCheck', () => {
    it('should return "OK"', () => {
      expect(appController.healthCheck()).toBe('OK');
    });
  });
});
