import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const body = z.object({
  operation: z.union([
    z.literal('add'),
    z.literal('subtract'),
    z.literal('multiply'),
    z.literal('divide'),
  ]),
  data: z.array(z.number().min(1).max(10)).min(2).max(5),
});

const response = z.object({
  id: z.string().uuid(),
});

export class JobDto extends createZodDto(body) {}
export class ResponseDto extends createZodDto(response) {}
