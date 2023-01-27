import { get } from 'env-var';

export enum AppEnv {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

const APP_ENVS = Object.values(AppEnv);

export class ServerConfig {
  public static readonly NODE_ENV: AppEnv = get('NODE_ENV').required().asEnum(APP_ENVS);

  public static readonly PORT: number = get('PORT').required().asPortNumber();

  public static readonly JWT_ACCESS_SECRET: string = get('JWT_ACCESS_SECRET').required().asString();

  public static readonly JWT_REFRESH_SECRET: string = get('JWT_REFRESH_SECRET').required().asString();

  public static readonly JWT_ACCESS_TTL_IN_MINUTES: number = get('JWT_ACCESS_TTL_IN_MINUTES').default(15).required().asInt();

  public static readonly JWT_SECRET_TTL_IN_DAYS: number = get('JWT_SECRET_TTL_IN_DAYS').default(7).required().asInt();

  public static readonly JWT_COOKIE_SECURE: boolean = get('JWT_COOKIE_SECURE').default('false').asBool();

  public static readonly SENDGRID_API_KEY:string = get('SENDGRID_API_KEY').required().asString();
}
