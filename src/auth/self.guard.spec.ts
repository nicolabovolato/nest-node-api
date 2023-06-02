import { Test } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';

import { SelfGuard } from './self.guard';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

describe('SelfGuard', () => {
  let selfGuard: SelfGuard;
  let reflector: DeepMocked<Reflector>;
  const context = createMock<ExecutionContext>();

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SelfGuard,
        {
          provide: Reflector,
          useValue: createMock<Reflector>(),
        },
      ],
    }).compile();

    selfGuard = moduleRef.get(SelfGuard);
    reflector = moduleRef.get(Reflector);
  });

  describe('canActivate', () => {
    it('should return true on equal sub', async () => {
      reflector.get.mockReturnValue('id');
      context.switchToHttp().getRequest.mockReturnValue({
        claims: {
          sub: 'user-id',
          role: 'user',
        },
        params: {
          id: 'user-id',
        },
      });
      expect(selfGuard.canActivate(context)).toEqual(true);
    });

    it('should return false on different sub', async () => {
      reflector.get.mockReturnValue('id');
      context.switchToHttp().getRequest.mockReturnValue({
        claims: {
          sub: 'user-id-2',
          role: 'user',
        },
        params: {
          id: 'user-id',
        },
      });
      expect(selfGuard.canActivate(context)).toEqual(false);
    });

    it('should return false on missing claims', async () => {
      reflector.get.mockReturnValue(['admin', 'user']);
      context.switchToHttp().getRequest.mockReturnValue({
        claims: undefined,
        params: {
          id: 'user-id',
        },
      });
      expect(selfGuard.canActivate(context)).toEqual(false);
    });

    it('should return false on missing sub', async () => {
      reflector.get.mockReturnValue(['admin', 'user']);
      context.switchToHttp().getRequest.mockReturnValue({
        claims: {
          sub: 'user-id',
          role: 'user',
        },
        params: {
          id: undefined,
        },
      });
      expect(selfGuard.canActivate(context)).toEqual(false);
    });
  });
});
