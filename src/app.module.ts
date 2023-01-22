import { BullModule } from '@nestjs/bull';
import {
  CacheStoreFactory,
  MiddlewareConsumer,
  NestModule,
  BadRequestException,
  CacheModule,
  Module,
  ValidationPipe,
  HttpException,
} from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE, RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentryModule, SentryInterceptor } from '@ntegral/nestjs-sentry';
import * as redisStore from 'cache-manager-redis-store';
import type { ValidationError } from 'class-validator';
import type { RedisClientOptions } from 'redis';

import { CommonModule } from './common/common.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { DbConfig } from './config/db.config';
import { RedisConfig } from './config/redis.config';
import { SentryConfig } from './config/sentry.config';
import { ServerConfig } from './config/server.config';
import { AdminJSModule } from './modules/adminjs/adminjs.module';
import { CategoryModule } from './modules/category/category.module';
import { CityModule } from './modules/cities/city.module';
import { ProductModule } from './modules/product/product.module';
import { RestaurantModule } from './modules/restaurant/restaurant.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    AdminJSModule,
    SentryModule.forRoot({
      dsn: SentryConfig.SENTRY_DSN,
      debug: false,
      environment: ServerConfig.NODE_ENV,
      logLevels: ['debug'], // based on sentry.io loglevel //
    }),
    // Database
    // https://docs.nestjs.com/techniques/database
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: DbConfig.DB_HOST,
      port: DbConfig.DB_PORT,
      database: DbConfig.DB_NAME,
      username: DbConfig.DB_USERNAME,
      password: DbConfig.DB_PASSWORD,
      logging: DbConfig.DB_LOG_ENABLE,
      entities: [`${__dirname}/modules/**/*.entity.{js,ts}`],
    }),
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      store: <CacheStoreFactory>redisStore,
      url: RedisConfig.REDIS_URL,
    }),
    BullModule.forRoot({
      url: RedisConfig.REDIS_URL,
    }),
    // Service Modules
    CommonModule, // Global
    RestaurantModule,
    CityModule,
    // Module Router
    // https://docs.nestjs.com/recipes/router-module
    RouterModule.register([]),
    UserModule,
    ProductModule,
    CategoryModule,
  ],
  providers: [
    // Global Guard, Authentication check on all routers
    // { provide: APP_GUARD, useClass: AuthenticatedGuard },
    // Global Filter, Exception check
    // { provide: APP_FILTER, useClass: ExceptionsFilter },
    // Global Pipe, Validation check
    // https://docs.nestjs.com/pipes#global-scoped-pipes
    // https://docs.nestjs.com/techniques/validation
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        // disableErrorMessages: true,
        transform: true,
        whitelist: true,
        exceptionFactory: (errors: ValidationError[]): BadRequestException => new BadRequestException(errors),
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => new SentryInterceptor({
        filters: [{
          type: HttpException,
          filter: (exception: HttpException) => exception.getStatus() > 500, // Only report 500 errors
        }],
      }),
    },
  ],
})
export class AppModule implements NestModule {
  // Global Middleware, Inbound logging
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
