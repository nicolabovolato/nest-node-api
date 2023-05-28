import { ConfigType, registerAs } from '@nestjs/config';
import { version } from '../../package.json';

const config = registerAs('logger', () => ({
  level: process.env.LOG_LEVEL || 'info',
  version,
}));

export default config;
export type Config = ConfigType<typeof config>;
