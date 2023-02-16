import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';
import { ChefOrderController } from './controllers/chef-order.controller';
import { ManagerOrderController } from './controllers/manager-order.controller';
import { OrderController } from './controllers/order.controller';
import { OrderAddressEntity } from './entities/order-address.entity';
import { OrderProductEntity } from './entities/order-product.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderAddressService } from './services/order-address.service';
import { OrderProductService } from './services/order-product.service';
import { OrderService } from './services/order.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, OrderAddressEntity, OrderProductEntity]), UserModule],
  providers: [OrderService, OrderProductService, OrderAddressService],
  controllers: [OrderController, ManagerOrderController, ChefOrderController],
  exports: [OrderService],
})
export class OrderModule {}
