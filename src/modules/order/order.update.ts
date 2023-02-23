import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Ctx, Hears, InjectBot, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import type { Repository } from 'typeorm';

import { TelegramConfig } from '@/config/telegram.config';

import type { OrderProduct } from '../product/interface/product.interface';
import { EventType } from '../telegram/enums/event-type.enum';
import { TelegramChatService } from '../telegram/services/telegram-chat.service';
import { TELEGRAM_STATUS_MESSAGES } from '../telegram/telegram.constants';
import { OrderTrackEntity } from './entities/order-track.entity';
import type { OrderEvent } from './events/order.event';
import { OrderTrackService } from './services/order-track.service';
import { OrderService } from './services/order.service';

@Update()
export class OrderUpdate {
  private regex: RegExp = /orderId=(\d+)/;

  constructor(
    @InjectRepository(OrderTrackEntity)
    private readonly orderTrackRepository:Repository<OrderTrackEntity>,
    private readonly orderService: OrderService,
    private readonly telegramChatService: TelegramChatService,
    private readonly orderTrackService: OrderTrackService,
    @InjectBot(TelegramConfig.TELEGRAM_BOT_NAME) private readonly bot:Telegraf,
  ) {}

  @Hears(/^\/start[ =](.+)$/)
  public async link(@Ctx() ctx: Context): Promise<void> {
    if (ctx.chat === undefined) return;
    if (ctx.message === undefined) return;
    if (!('text' in ctx.message)) return;

    const tgChatId = ctx.chat.id;

    const b64 = ctx.message.text.split(' ')[1];
    const decode = Buffer.from(b64, 'base64').toString('utf-8');
    const orderIdMatch = decode.match(this.regex);
    const orderId = Number(orderIdMatch ? orderIdMatch[1] : null);
    if (!orderId) {
      await ctx.reply('К сожалению вашего заказа не существует \u{1F625}');
      return;
    }
    await this.telegramChatService.create(tgChatId);
    await this.orderTrackService.create(orderId, tgChatId);

    const order = await this.orderService.getOrder(orderId);
    await ctx.reply('Саламалейкум кожаный');
    const orderDetails = order.products.map(
      (product: OrderProduct) => `${product.name}\n` + `Количество: ${product.quantity}\n` + `Цена(1шт): ${product.price}тг` + '\n',
    ).join('');

    await ctx.reply(
      `\u{1F464}Имя: ${order.user.name}\n`
    + `\u{1F4F1}Номер: ${order.user.phone}\n\n`
    + `\u{1F4C3}Заказ #${orderId}:\n`
    + `${orderDetails}` + '\n'
    + `\u{1F3E0}Адрес: ${order.address} ${order.addressDetails}\n`
    + `\u{1F4B5}Итого: ${order.total}\n`
    + `\u{1F51C}Статус: ${order.status}\n`
    + `\u{1F551}Время заказа: ${order.createdAt}`,
    );
  }

  @OnEvent(EventType.ORDER_STATUS_CHANGE)
  public async handleOrderStatusChange(event:OrderEvent):Promise<void> {
    const chats = <Pick<OrderTrackEntity, 'tgChatId'>[]> await this.orderTrackRepository.find({ where: { orderId: event.orderId } });
    const tgChatIds = _.map(chats, 'tgChatId');
    const message = `Заказ #${event.orderId}\n${TELEGRAM_STATUS_MESSAGES[event.status]}`;

    tgChatIds?.forEach(async (tgChatId:number) => {
      await this.bot.telegram.sendMessage(tgChatId, message);
    });
  }
}
