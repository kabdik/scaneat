import { get } from 'env-var';

export class SentryConfig {
  public static readonly SENTRY_DSN: string = get('SENTRY_DSN').required().asString();
}
