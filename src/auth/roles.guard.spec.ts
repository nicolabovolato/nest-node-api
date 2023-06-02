import { Test } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';

import { RolesGuard } from './roles.guard';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;
  let reflector: DeepMocked<Reflector>;
  const context = createMock<ExecutionContext>();

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: createMock<Reflector>(),
        },
      ],
    }).compile();

    rolesGuard = moduleRef.get(RolesGuard);
    reflector = moduleRef.get(Reflector);
  });

  describe('canActivate', () => {
    it('should return true on valid role', async () => {
      reflector.get.mockReturnValue(['user']);
      context.switchToHttp().getRequest.mockReturnValue({
        claims: {
          role: 'user',
          sub: 'user-id',
        },
      });
      expect(rolesGuard.canActivate(context)).toEqual(true);
    });

    it('should return false on invalid role', async () => {
      reflector.get.mockReturnValue(['admin']);
      context.switchToHttp().getRequest.mockReturnValue({
        claims: {
          role: 'user',
          sub: 'user-id',
        },
      });
      expect(rolesGuard.canActivate(context)).toEqual(false);
    });

    it('should return false on missing claims', async () => {
      reflector.get.mockReturnValue(['admin', 'user']);
      context.switchToHttp().getRequest.mockReturnValue({
        claims: undefined,
      });
      expect(rolesGuard.canActivate(context)).toEqual(false);
    });
  });
});
