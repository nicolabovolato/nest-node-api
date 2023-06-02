import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Claims } from './auth.entity';

@Injectable()
export class SelfGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const subParam = this.reflector.get<string>(
      'subParam',
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();
    const claims: Claims | undefined = request.claims;
    const sub: string | undefined = request.params?.[subParam];

    if (!claims || !sub || sub != claims.sub) return false;

    return true;
  }
}
