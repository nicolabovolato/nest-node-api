import { ConfigType, registerAs } from '@nestjs/config';

const config = registerAs('cache', () => ({
  connectionString: process.env.CACHE_URL || 'redis://localhost:6379/0',
  timeoutMs: Number(process.env.CACHE_TIMEOUT_MS || 5000),
}));

export default config;
export type Config = ConfigType<typeof config>;
