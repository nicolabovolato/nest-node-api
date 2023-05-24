import { Injectable } from '@nestjs/common';

import { Logger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class LoggerService extends Logger {
  constructor(logger: PinoLogger) {
    super(logger, { renameContext: 'module' });
  }
}
