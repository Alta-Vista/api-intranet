import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { HttpException, ValidationPipe } from '@nestjs/common';

const whiteList = [
  String(process.env.APP_WEB_URL),
  String(process.env.AUTH0_MANAGEMENT_URL),
  'https://app.altavistainvest.com.br', // Adicione o domínio aqui
];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('v2');
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());
  app.enableCors({
    origin: (origin, cb) => {
      if (whiteList.includes(origin) || !origin) {
        cb(null, true);
      } else {
        cb(new HttpException('Not allowed by CORS', 403));
      }
    },
  });

  const server = await app.listen(3000);

  server.setTimeout(15000);
}

bootstrap();
