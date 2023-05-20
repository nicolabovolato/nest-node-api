import { version } from '../package.json';

export type Config = {
  port: number;
  logLevel: string;
  version: string;
};

export default (): Config => ({
  port: Number(process.env.PORT || 80),
  logLevel: process.env.LOG_LEVEL || 'info',
  version,
});
