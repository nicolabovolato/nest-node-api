import { Test } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: DeepMocked<AuthService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: createMock<AuthService>(),
        },
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
    authController = moduleRef.get(AuthController);
  });

  describe('token', () => {
    it('should return a token', async () => {
      authService.sign.mockResolvedValue('token');

      expect(
        await authController.token({
          role: 'user',
          sub: 'user-id',
        }),
      ).toEqual({ token: 'token' });

      expect(authService.sign).toBeCalledWith({
        role: 'user',
        sub: 'user-id',
      });
    });
  });

  describe('protected', () => {
    it('should return a message', async () => {
      expect(await authController.protected()).toEqual({
        message: expect.any(String),
      });
    });
  });

  describe('user', () => {
    it('should return a message', async () => {
      expect(await authController.user({ email: 'email' })).toEqual({
        message: expect.any(String),
      });
    });
  });

  describe('admin', () => {
    it('should return a message', async () => {
      expect(await authController.admin()).toEqual({
        message: expect.any(String),
      });
    });
  });
});
