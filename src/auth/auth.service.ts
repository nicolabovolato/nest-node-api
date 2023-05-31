import { Inject, UnauthorizedException } from '@nestjs/common';

import { V4, errors as pasetoErrors } from 'paseto';
import { z } from 'nestjs-zod/z';

import config, { Config } from './auth.config';
import { Claims } from './auth.entity';

const claimsValidator = z.object({
  sub: z.string(),
  role: z.union([z.literal('user'), z.literal('admin')]),
});

export class AuthService {
  constructor(
    @Inject(config.KEY)
    private readonly config: Config,
  ) {}

  async sign(claims: Claims) {
    return await V4.sign(claims, this.config.privateKey, {
      expiresIn: `${this.config.expireInMs / 1000}s`,
    });
  }

  async verify(token: string) {
    const tokenClaims = await this.verifyWrapped(token);
    const validation = await claimsValidator.safeParseAsync(tokenClaims);

    if (!validation.success) throw new UnauthorizedException();

    return validation.data;
  }

  private async verifyWrapped(token: string) {
    try {
      return await V4.verify(token, this.config.publicKey);
    } catch (err) {
      if (err instanceof pasetoErrors.PasetoError) {
        switch (err.constructor) {
          case pasetoErrors.PasetoClaimInvalid:
          case pasetoErrors.PasetoInvalid:
          case pasetoErrors.PasetoNotSupported:
          case pasetoErrors.PasetoVerificationFailed:
            throw new UnauthorizedException();
        }
      }

      throw err;
    }
  }
}
