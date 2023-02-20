import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  /*
  |--------------------------------------------------------------------------
  | Swagger
  |--------------------------------------------------------------------------
  |
  | Swagger is a Open-Source framework to design and document your api.
  | The added tags define our RESTful resource endpoints.
  |
  */

  const docsOptions = new DocumentBuilder()
    .setTitle('Legit test - Evgeny Subotin')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, docsOptions, {
    deepScanRoutes: true,
  });

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      persistAuthorization: true,
    },
  });

  const logger = new Logger('AppBootstrap');

  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    logger.log(`Server is listen on http://localhost:${port}`);
  });
}
bootstrap();
