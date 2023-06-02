import { Test } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Claims } from './auth.entity';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authService: DeepMocked<AuthService>;
  const context = createMock<ExecutionContext>();

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: AuthService,
          useValue: createMock<AuthService>(),
        },
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
    authGuard = moduleRef.get(AuthGuard);
  });

  describe('canActivate', () => {
    it('should set claims on request', async () => {
      const claims: Claims = {
        role: 'user',
        sub: 'user-id',
      };
      authService.verify.mockResolvedValue(claims);
      context.switchToHttp().getRequest.mockReturnValue({
        headers: { authorization: 'Bearer token' },
      });

      expect(await authGuard.canActivate(context)).toEqual(true);

      expect(authService.verify).toBeCalledWith('token');
      expect(context.switchToHttp().getRequest()).toMatchObject({
        claims,
      });
    });

    it('should fail on missing auth header', async () => {
      context.switchToHttp().getRequest.mockReturnValue({
        headers: {},
      });

      await expect(authGuard.canActivate(context)).rejects.toThrowError(
        UnauthorizedException,
      );
    });

    it.each(['', 'Bearer', 'Bearer '])(
      'should fail on invalid auth header (%#)',
      async (authorization) => {
        context.switchToHttp().getRequest.mockReturnValue({
          headers: { authorization },
        });

        await expect(authGuard.canActivate(context)).rejects.toThrowError(
          UnauthorizedException,
        );
      },
    );
  });
});
