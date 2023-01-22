import { AdminModule } from '@adminjs/nestjs';
import * as AdminJSTypeorm from '@adminjs/typeorm';
import { Module } from '@nestjs/common';
import AdminJS from 'adminjs';

import { AdminJSConfig } from '@/config/adminjs.config';

import { ADMINJS_RESOURCES } from './adminjs.constants';

const DEFAULT_ADMIN = {
  email: AdminJSConfig.ADMINJS_ADMIN_EMAIL,
  password: AdminJSConfig.ADMINJS_ADMIN_PASSWORD,
};

const authenticate = async (email: string, password: string): Promise<typeof DEFAULT_ADMIN | null> => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

AdminJS.registerAdapter({
  Resource: AdminJSTypeorm.Resource,
  Database: AdminJSTypeorm.Database,
});

@Module({
  imports: [
    AdminModule.createAdminAsync({
      useFactory: () => ({
        adminJsOptions: {
          rootPath: AdminJSConfig.ADMINJS_ROOT_PATH,
          resources: ADMINJS_RESOURCES,
          logoutPath: `${AdminJSConfig.ADMINJS_ROOT_PATH}/logout`,
          loginPath: `${AdminJSConfig.ADMINJS_ROOT_PATH}/login`,
        },
        auth: {
          authenticate,

          cookieName: AdminJSConfig.ADMINJS_COOKIE_NAME,
          cookiePassword: AdminJSConfig.ADMINJS_COOKIE_PASSWORD,
        },
        sessionOptions: {
          resave: true,
          saveUninitialized: true,
          secret: AdminJSConfig.ADMINJS_SESSION_PASSWORD,
        },
      }),
    }),
  ],
  providers: [],
  exports: [],
  controllers: [],
})
export class AdminJSModule {}
