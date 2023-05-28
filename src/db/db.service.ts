import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from 'nestjs-prisma';

import config, { Config } from './db.config';

@Injectable()
export class DatabaseService extends PrismaService {
  constructor(
    @Inject(config.KEY)
    config: Config,
  ) {
    super({
      prismaOptions: {
        datasources: {
          db: {
            url: config.connectionString,
          },
        },
      },
    });
  }
}
