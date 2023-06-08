import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ZodSerializerDto } from 'nestjs-zod';

import { JobDto, ResponseDto } from './job.dto';
import { JobService } from './job.service';

@ApiTags('jobs')
@Controller({
  path: 'jobs',
  version: '1',
})
export class JobController {
  constructor(private readonly service: JobService) {}

  @Post()
  @ZodSerializerDto(ResponseDto)
  @ApiOkResponse({
    type: ResponseDto,
  })
  async create(@Body() job: JobDto) {
    const id = await this.service.add(job);
    return { id };
  }
}
