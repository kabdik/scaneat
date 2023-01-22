import { Logger as NestLogger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { RedisIoAdapter } from '@/common/adapters/redis.adapter';

import { middleware } from './app.middleware';
import { AppModule } from './app.module';
import { Logger } from './common/logger';
import { RedisConfig } from './config/redis.config';
import { ServerConfig } from './config/server.config';

function setupApiDocument(app: NestExpressApplication): void {
  // swagger
  const config = new DocumentBuilder()
    .setTitle('Api docs')
    .setDescription('The Nutrix API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}

/**
 * https://docs.nestjs.com
 * https://github.com/nestjs/nest/tree/master/sample
 * https://github.com/nestjs/nest/issues/2249#issuecomment-494734673
 */
async function bootstrap(): Promise<string> {
  const isProduction = ServerConfig.NODE_ENV === 'production';
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useLogger(await app.resolve(Logger));

  if (isProduction) {
    app.enable('trust proxy');
  }

  // Express Middleware
  middleware(app);

  // swagger
  setupApiDocument(app);

  // redis adapter
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis(RedisConfig.REDIS_URL);

  app.useWebSocketAdapter(redisIoAdapter);

  // GRACEFUL SHUTDOWN
  app.enableShutdownHooks();

  await app.listen(ServerConfig.PORT);

  return app.getUrl();
}

(async (): Promise<void> => {
  try {
    const url = await bootstrap();
    NestLogger.log(url, 'Bootstrap');
  } catch (error) {
    NestLogger.error(error, 'Bootstrap');
  }
})();
