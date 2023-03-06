import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AuthorizationService } from './authorization/authorization.service.js';
import { HttpModule } from './http.module.js';

export const bootstrap = (port: number) => {
  return new Promise<string>(async (resolve, reject) => {
    const app = await NestFactory.create<NestExpressApplication>(HttpModule, {
      cors: true,
      logger: ['error'],
    });

    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI });

    const authorizeService = app.get(AuthorizationService);

    authorizeService.event$.subscribe({
      next: (value) => {
        app.close();
        resolve(value);
      },
      error: (value) => {
        app.close();
        reject(value);
      },
    });

    await app.listen(port);
  });
};
