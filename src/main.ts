import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { Config } from './app.config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      bufferLogs: true,
    },
  );
  app.useLogger(app.get(Logger));

  const config = app.get<ConfigService<Config>>(ConfigService);
  const port = config.getOrThrow('port');

  await app.listen(config.getOrThrow('port'), '::');

  const logger = app.get<Logger>(Logger);
  logger.log(`Listening on http://[::]:${port}`);
}
bootstrap();
