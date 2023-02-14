import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { ProductEntity } from '../../product/entitites/product.entity';
import type { OrderProductDto } from '../dto/create-order.body.dto';
import { OrderProductEntity } from '../entities/order-product.entity';
import type { OrderProduct } from '../interfaces/order-product.interface';

@Injectable()
export class OrderProductService {
  constructor(
    @InjectRepository(OrderProductEntity) private readonly orderProductRepository:Repository<OrderProductEntity>,
  ) {}

  public async createOrderProduct(
    orderId:number,
    orderProducts: OrderProductDto[],
    em?:EntityManager,
  ):Promise<OrderProduct[]> {
    const entityManager = em || this.orderProductRepository.manager;

    const data = await Promise.all(orderProducts.map(async (orderProduct:OrderProductDto) => {
      const product = await entityManager.findOneBy(ProductEntity, { id: orderProduct.productId, isDeleted: false });
      if (!product) {
        throw new BadRequestException(`продукта c ${orderProduct.productId} не существует`);
      }

      return {
        orderId,
        productId: product.id,
        unitPrice: product.unitPrice,
        price: product.price,
        quantity: orderProduct.quantity,
      };
    }));

    return entityManager.save(OrderProductEntity, data);
  }
}
