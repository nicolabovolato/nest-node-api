import { ConfigType, registerAs } from '@nestjs/config';

const config = registerAs('logger', () => ({
  connectionString: process.env.QUEUE_URL || 'redis://localhost:6379/1',
  timeoutMs: Number(process.env.QUEUE_TIMEOUT_MS || 5000),
}));

export default config;
export type Config = ConfigType<typeof config>;
