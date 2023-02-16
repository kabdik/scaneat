import { Ctx, Hears, InjectBot, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

import { TelegramConfig } from '@/config/telegram.config';

import { OrderService } from '../order/services/order.service';
import type { OrderProduct } from '../product/interface/product.interface';

@Update()
export class TelegramUpdate {
  private regex: RegExp = /orderId=(\d+)/;

  constructor(@InjectBot(TelegramConfig.TELEGRAM_BOT_NAME) private readonly bot: Telegraf, private readonly orderService: OrderService) {}

  @Hears(/^\/start[ =](.+)$/)
  public async link(@Ctx() ctx: Context): Promise<void> {
    console.log(this.bot);

    if (ctx.message === undefined) return;
    if (!('text' in ctx.message)) return;

    await ctx.reply('Саламалейкум кожаный');

    const b64 = ctx.message.text.split(' ')[1];
    const decode = Buffer.from(b64, 'base64').toString('utf-8');
    const orderIdMatch = decode.match(this.regex);
    const orderId = Number(orderIdMatch ? orderIdMatch[1] : null);
    if (!orderId) {
      await ctx.reply('К сожалению вашего заказа не существует \u{1F625}');
      return;
    }
    const order = await this.orderService.getOrder(orderId);
    await ctx.reply(
      `\u{1F464}Имя: ${order.user.name}\n`
    + `\u{1F4F1}Номер: ${order.user.phone}\n\n`
    + '\u{1F4C3}Ваш заказ:\n'
    + `${order.products.map(
      (product: OrderProduct) => `${product.name}\n` + `Количество: ${product.quantity}\n` + `Цена(1шт): ${product.price}тг` + '\n',
    ).join('')}` + '\n'
    + `\u{1F3E0}Адрес: ${order.address} ${order.addressDetails}\n`
    + `\u{1F4B5}Итого: ${order.total}\n`
    + `\u{1F51C}Статус: ${order.status}`,
    );
  }
}
