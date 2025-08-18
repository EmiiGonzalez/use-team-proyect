import { ConfigModule, ConfigService } from '@nestjs/config';

export const configModule = ConfigModule.forRoot({
  envFilePath: `${
    process.env.NODE_ENV != undefined && process.env.NODE_ENV.trim() != ''
      ? `.${process.env.NODE_ENV.trim()}.env`
      : '.env'
  }`,
  isGlobal: true,
});

export const configService = new ConfigService();
