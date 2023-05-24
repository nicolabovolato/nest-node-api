import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from 'nestjs-prisma';

import { Config } from './db.config';

@Injectable()
export class DatabaseService extends PrismaService {
  constructor(
    @Inject(ConfigService<Config>) // Decorator hell
    config: ConfigService<Config>,
  ) {
    super({
      prismaOptions: {
        datasources: {
          db: {
            url: config.getOrThrow('connectionString'),
          },
        },
      },
    });
  }
}
