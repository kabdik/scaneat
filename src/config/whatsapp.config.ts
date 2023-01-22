import { get } from 'env-var';

export class WhatsappConfig {
  public static readonly WHATSAPP_API_KEY: string = get('WHATSAPP_API_KEY').required().asString();

  public static readonly WHATSAPP_WEBHOOK_SECRET: string = get('WHATSAPP_WEBHOOK_SECRET').required().asString();

  public static readonly WHATSAPP_API_URL: string = get('WHATSAPP_API_URL').required().asUrlString();
}
