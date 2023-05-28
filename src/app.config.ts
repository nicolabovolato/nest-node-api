import { ConfigType, registerAs } from '@nestjs/config';

const config = registerAs('app', () => ({
  port: Number(process.env.PORT || 80),
  openapi: !!process.env.EXPOSE_OPENAPI || process.env.NODE_ENV != 'production',
}));

export default config;
export type Config = ConfigType<typeof config>;
