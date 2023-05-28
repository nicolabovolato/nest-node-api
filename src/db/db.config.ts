import { ConfigType, registerAs } from '@nestjs/config';

const config = registerAs('db', () => ({
  connectionString:
    process.env.DATABASE_URL || 'postgres://user:pass@localhost:5432/db',
  timeoutMs: Number(process.env.DATABASE_TIMEOUT_MS || 5000),
}));

export default config;
export type Config = ConfigType<typeof config>;
