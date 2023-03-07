import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { HttpException } from '@nestjs/common';

const whiteList = [
  String(process.env.APP_WEB_URL),
  String(process.env.AUTH0_MANAGEMENT_URL),
];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('v2');
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
  await app.listen(3000);
}
bootstrap();
