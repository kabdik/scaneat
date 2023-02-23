import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TelegramModule } from '../telegram/telegram.module';
import { UserModule } from '../user/user.module';
import { ChefOrderController } from './controllers/chef-order.controller';
import { ManagerOrderController } from './controllers/manager-order.controller';
import { OrderController } from './controllers/order.controller';
import { OrderAddressEntity } from './entities/order-address.entity';
import { OrderProductEntity } from './entities/order-product.entity';
import { OrderTrackEntity } from './entities/order-track.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderUpdate } from './order.update';
import { OrderAddressService } from './services/order-address.service';
import { OrderProductService } from './services/order-product.service';
import { OrderTrackService } from './services/order-track.service';
import { OrderService } from './services/order.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, OrderAddressEntity, OrderProductEntity, OrderTrackEntity]), UserModule, TelegramModule],
  providers: [OrderService, OrderProductService, OrderAddressService, OrderTrackService, OrderUpdate],
  controllers: [OrderController, ManagerOrderController, ChefOrderController],
  exports: [OrderService],
})
export class OrderModule {}
