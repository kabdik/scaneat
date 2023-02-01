import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderAddressEntity } from './entities/order-address.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, OrderAddressEntity])],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
