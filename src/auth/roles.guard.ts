import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Claims } from './auth.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Claims['role'][]>(
      'roles',
      context.getHandler(),
    );
    const claims: Claims | undefined = context
      .switchToHttp()
      .getRequest().claims;

    if (!claims || !roles.includes(claims.role)) return false;

    return true;
  }
}
