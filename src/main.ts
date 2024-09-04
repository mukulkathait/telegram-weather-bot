import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Access the underlying Express instance
  // const expressApp = app.getHttpAdapter().getInstance();

  // expressApp.set('trust proxy', true);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.use(helmet());

  // app.use(
  //   rateLimit({
  //     windowMs: 15 * 60 * 1000, // 15 minutes
  //     max: 100, // Limit each IP to 100 requests per windowMs
  //   }),
  // );

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 3600000,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
