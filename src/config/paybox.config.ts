import { get } from 'env-var';

export class PayboxConfig {
  public static readonly PAYBOX_URL: string = get('PAYBOX_URL').required().asUrlString();

  public static readonly PAYBOX_PROJECT_ID: number = get('PAYBOX_PROJECT_ID').required().asInt();

  public static readonly PAYBOX_PAYMENT_SECRET: string = get('PAYBOX_PAYMENT_SECRET').required().asString();

  public static readonly PAYBOX_PAYOUT_SECRET: string = get('PAYBOX_PAYOUT_SECRET').required().asString();
}
