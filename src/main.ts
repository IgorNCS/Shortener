import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import * as YAML from 'yamljs';
import * as swaggerUi from 'swagger-ui-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));

  const swaggerDocument = YAML.load('./documentation.swagger.yaml');

  app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  await app.listen(process.env.PORT);
}
bootstrap();
