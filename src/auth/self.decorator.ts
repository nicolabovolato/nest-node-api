import { SetMetadata } from '@nestjs/common';

export const Self = (subParam: string) => SetMetadata('subParam', subParam);
