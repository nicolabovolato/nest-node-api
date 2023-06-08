import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { ZodSerializerDto } from 'nestjs-zod';

import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

import {
  ParamsDto,
  ClaimsDto,
  ProtectedResponseDto,
  TokenResponseDto,
  paramsSchema,
} from './auth.dto';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { SelfGuard } from './self.guard';
import { Self } from './self.decorator';

@ApiTags('auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('token')
  @ZodSerializerDto(TokenResponseDto)
  @ApiOkResponse({
    type: TokenResponseDto,
  })
  async token(@Body() body: ClaimsDto) {
    const token = await this.service.sign(body);
    return { token };
  }

  @Get('protected')
  @UseGuards(AuthGuard)
  @ZodSerializerDto(ProtectedResponseDto)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ProtectedResponseDto,
  })
  async protected() {
    return { message: 'Access granted!' };
  }

  @Get('user/:email')
  @Self('email')
  @UseGuards(AuthGuard, SelfGuard)
  @ZodSerializerDto(ProtectedResponseDto)
  @ApiBearerAuth()
  @ApiParam({
    name: 'email',
    schema: paramsSchema.properties!.email as SchemaObject,
  })
  @ApiOkResponse({
    type: ProtectedResponseDto,
  })
  async user(@Param() { email }: ParamsDto) {
    return { message: 'Access granted!' };
  }

  @Get('admin')
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @ZodSerializerDto(ProtectedResponseDto)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ProtectedResponseDto,
  })
  async admin() {
    return { message: 'Access granted!' };
  }
}
