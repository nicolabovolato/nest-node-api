import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly service: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader: string | undefined = request.headers?.authorization;
    const token = authHeader?.substring(7);
    if (!token) throw new UnauthorizedException();

    request.claims = await this.service.verify(token);
    return true;
  }
}
