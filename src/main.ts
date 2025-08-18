import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { corsOptions } from './config/cors';
import { ConfigService } from '@nestjs/config';
import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan('dev'));
  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: {
        enableImplicitConversion: true
      },
      whitelist: true,
      transform: true
    })
  );
  const configService = app.get(ConfigService);

  app.enableCors(corsOptions);
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('UseTeam Kanban')
    .setDescription('UseTeam Kanban API description')
    .setVersion('1.0')
    .addTag('UseTeam Kanban')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  await app.listen(configService.get<string>('PORT') ?? 3000);
  Logger.log(`Server running on: ${await app.getUrl()}`);
}
bootstrap();
