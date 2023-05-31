import { ConfigType, registerAs } from '@nestjs/config';

const config = registerAs('token-auth', () => ({
  privateKey: process.env.PASETO_PRIVATE_KEY || '',
  publicKey: process.env.PASETO_PUBLIC_KEY || '',
  expireInMs: Number(process.env.AUTH_TOKEN_EXPIRATION_MS || 5 * 60 * 1000),
}));

export default config;
export type Config = ConfigType<typeof config>;
