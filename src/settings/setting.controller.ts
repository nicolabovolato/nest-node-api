import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { ZodSerializerDto } from 'nestjs-zod';

import { SettingService } from './setting.service';
import { ParamsDto, SettingDto, paramsSchema } from './setting.dto';

@ApiTags('settings')
@Controller({
  path: 'settings',
  version: '1',
})
export class SettingController {
  constructor(private readonly service: SettingService) {}

  @Get(':id')
  @ZodSerializerDto(SettingDto)
  @ApiParam({ name: 'id', schema: paramsSchema.properties!.id as SchemaObject })
  @ApiOkResponse({
    type: SettingDto,
  })
  async get(@Param() { id }: ParamsDto) {
    const value = await this.service.get(id);
    return { value };
  }

  @Put(':id')
  @ZodSerializerDto(SettingDto)
  @ApiParam({ name: 'id', schema: paramsSchema.properties!.id as SchemaObject })
  @ApiOkResponse({
    type: SettingDto,
  })
  async set(@Param() { id }: ParamsDto, @Body() body: SettingDto) {
    const value = await this.service.set(id, body.value);
    return { value };
  }
}
