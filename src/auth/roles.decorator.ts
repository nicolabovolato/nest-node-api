import { SetMetadata } from '@nestjs/common';

import { Claims } from './auth.entity';

export const Roles = (...roles: Claims['role'][]) =>
  SetMetadata('roles', roles);
