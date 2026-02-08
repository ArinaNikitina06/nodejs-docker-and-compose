import './polyfills';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { analyzeRoutes } from './core/utils/analyze-routes';
import { BodyRequiredPipe } from './core/pipes/body-required.pipe';
import { GlobalErrorInterceptor } from './core/interceptors/global-error.interceptor';
import * as cookieParser from 'cookie-parser';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 3000;

  app.useGlobalInterceptors(new GlobalErrorInterceptor());
  app.useGlobalPipes(new BodyRequiredPipe());
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

	app.useGlobalInterceptors(
		new ClassSerializerInterceptor(app.get(Reflector)),
	);

  await app.listen(port, () => {
    analyzeRoutes(app);
    console.log(`\n🚀 Сервер запущен: http://localhost:${port}`);
  });
}
bootstrap();
