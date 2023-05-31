import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import config from './auth.config';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';
import { SelfGuard } from './self.guard';
import { AuthController } from './auth.controller';

@Module({
  imports: [ConfigModule.forFeature(config)],
  providers: [AuthService, AuthGuard, RolesGuard, SelfGuard],
  exports: [AuthGuard, RolesGuard, SelfGuard],
  controllers: [AuthController],
})
export class AuthModule {}
