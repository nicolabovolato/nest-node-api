import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import config, { Config } from './app.config';

@Module({
  imports: [
    ConfigModule.forFeature(config),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService<Config>) => {
        return {
          pinoHttp: {
            level: config.getOrThrow('logLevel'),
            name: config.getOrThrow('version'),
          },
          useExisting: true,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
