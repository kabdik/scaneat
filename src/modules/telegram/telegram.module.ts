import { Module } from '@nestjs/common';

import { OrderModule } from '../order/order.module';
import { TelegramUpdate } from './telegram.update';

@Module({
  imports: [OrderModule],
  providers: [TelegramUpdate],

})
export class TelegramModule {

}
