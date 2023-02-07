import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { EntityManager, Repository } from 'typeorm';

import { OrderAddressEntity } from '../entities/order-address.entity';
import type { AddressWithDetails } from '../interfaces/order-address.interface';

@Injectable()
export class OrderAddressService {
  constructor(
    @InjectRepository(OrderAddressEntity)
    private readonly orderAddressRepository: Repository< OrderAddressEntity>,
  ) {}

  public async createOrderAddress(orderId: number, data:AddressWithDetails, em?:EntityManager):Promise<void> {
    const entityManager = em || this.orderAddressRepository.manager;

    const orderAddress = await entityManager.findOneBy(OrderAddressEntity, { orderId });
    if (orderAddress) {
      return;
    }

    await entityManager.save(OrderAddressEntity, { orderId, ...data });
  }
}
