import { Test } from '@nestjs/testing';

import { V2, V4 } from 'paseto';

import { AuthService } from './auth.service';
import { Claims } from './auth.entity';
import configFn, { Config } from './auth.config';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  const config: Config = {
    expireInMs: 10000,
    privateKey: `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIGgU582FmEz0i76AVAKH3NRcT+3fZu/SSXdhoFdzWfuH
-----END PRIVATE KEY-----`,
    publicKey: `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEARCsnT9JAkaWG+6BlBeJTKUmZY+xmn+xdwINSS4dhVHM=
-----END PUBLIC KEY-----`,
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: configFn.KEY,
          useValue: config,
        },
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
  });

  describe('sign', () => {
    it('should return a valid token', async () => {
      const claims: Claims = {
        role: 'user',
        sub: 'user-id',
      };

      const token = await authService.sign(claims);
      expect(await V4.verify(token, config.publicKey)).toMatchObject(claims);
    });
  });

  describe('verify', () => {
    it('should return token claims', async () => {
      const claims: Claims = { sub: 'user', role: 'admin' };
      const token = await V4.sign(claims, config.privateKey, {
        expiresIn: '1m',
      });
      await expect(authService.verify(token)).resolves.toEqual(claims);
    });

    it('should fail on invalid token version', async () => {
      const claims: Claims = { sub: 'user', role: 'admin' };
      const v2token = await V2.sign(claims, config.privateKey, {
        expiresIn: '1m',
      });
      await expect(authService.verify(v2token)).rejects.toThrowError(
        UnauthorizedException,
      );
    });

    it('should fail on expired token', async () => {
      const claims: Claims = { sub: 'user', role: 'admin' };
      const token = await V4.sign(claims, config.privateKey, {
        expiresIn: '0s',
      });
      await expect(authService.verify(token)).rejects.toThrowError(
        UnauthorizedException,
      );
    });

    it('should fail on token signed with another key', async () => {
      const claims: Claims = { sub: 'user', role: 'admin' };
      const key = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIGgU582FmEz0i76AVAKH3NRcT+3fZh/SSXdhoFdzWfuS
-----END PRIVATE KEY-----`;

      const token = await V4.sign(claims, key, {
        expiresIn: '1m',
      });
      await expect(authService.verify(token)).rejects.toThrowError(
        UnauthorizedException,
      );
    });

    it.each([
      { sub: true, role: 'user' },
      { sub: 'user', role: true },
      { sub: 'user', role: 'super' },
    ])('should fail on malformed claims (%#)', async (claims) => {
      const token = await V4.sign(claims, config.privateKey, {
        expiresIn: '1m',
      });
      await expect(authService.verify(token)).rejects.toThrowError(
        UnauthorizedException,
      );
    });
  });
});
