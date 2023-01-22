import { get } from 'env-var';

export class RedisConfig {
  public static readonly REDIS_URL: string = get('REDIS_URL').required().asString();
}
