import { get } from 'env-var';

export class AdminJSConfig {
  public static readonly ADMINJS_COOKIE_NAME: string = get('ADMINJS_COOKIE_NAME').default('adminjs').asString();

  public static readonly ADMINJS_COOKIE_PASSWORD: string = get('ADMINJS_COOKIE_PASSWORD').default('secret').asString();

  public static readonly ADMINJS_SESSION_PASSWORD: string = get('ADMINJS_SESSION_PASSWORD').default('secret').asString();

  public static readonly ADMINJS_ROOT_PATH: string = get('ADMINJS_ROOT_PATH').default('/oIxcWJhy').asString();

  public static readonly ADMINJS_ADMIN_EMAIL: string = get('ADMINJS_ADMIN_EMAIL').default('admin@nutrix.com').asString();

  public static readonly ADMINJS_ADMIN_PASSWORD: string = get('ADMINJS_ADMIN_PASSWORD')
    .default('SmHAvcjmCEhoTZjUYhypaFmrMxILYNsp')
    .asString();
}
