import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { EntityManager, Repository } from 'typeorm';

import { TableName } from '@/common/enums/table';
import { UtilService } from '@/common/providers/util.service';
import { ProductEntity } from '@/modules/product/entitites/product.entity';
import { RestaurantEntity } from '@/modules/restaurant/entities/restaurant.entity';
import { EventType } from '@/modules/telegram/enums/event-type.enum';

import { UserService } from '../../user/user.service';
import type { CreateOrderBodyDto, OrderProductDto } from '../dto/create-order.body.dto';
import { OrderEntity } from '../entities/order.entity';
import { ChefOrderStatus, OrderStatus } from '../enum/order-status.enum';
import { OrderType } from '../enum/order-type.enum';
import { OrderStatusChangeEvent } from '../events/order-status-change/order-status-change.event';
import type { TgLink } from '../interfaces/order-track.interface';
import type { GetOrder, Order } from '../interfaces/order.interface';
import { OrderAddressService } from './order-address.service';
import { OrderProductService } from './order-product.service';

@Injectable()
export class OrderService {
  private chefStatus: Array<string> = ['pending', 'processing', 'ready'];
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly userService: UserService,
    private readonly orderProductService: OrderProductService,
    private readonly orderAddressService: OrderAddressService,
    private readonly utilService: UtilService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async createOrder({ name, phone, ...data }: CreateOrderBodyDto, restaurantId: number): Promise<TgLink> {
    return this.orderRepository.manager.transaction(async (em: EntityManager) => {
      const recalculatedTotal = await this.recalculateTotal(data.products, em);

      if (recalculatedTotal !== data.total) {
        throw new BadRequestException('The total price of the order is incorrect');
      }

      const profit = await this.orderProfit(recalculatedTotal, data.products, em);

      const client = await this.userService.createClient({ name, phone }, em);

      const order = <Order> await em.save(OrderEntity, {
        total: recalculatedTotal,
        profit,
        userId: client.id,
        restaurantId,
        type: data.type,
        description: data.description,
      });

      await this.orderProductService.createOrderProduct(order.id, data.products, em);

      if (data.type === OrderType.DELIVERY) {
        const { cityId } = <Pick<RestaurantEntity, 'cityId'>> await em.findOne(RestaurantEntity, {
          where: { id: restaurantId },
          select: ['cityId'],
        });
        await this.orderAddressService.createOrderAddress(order.id, { address: data.address, details: data.details, cityId }, em);
      }
      return { tgLink: this.utilService.generateTgLink(order.id) };
    });
  }

  public async recalculateTotal(orderProducts: OrderProductDto[], em: EntityManager): Promise<number> {
    return Promise.all(
      orderProducts.map(async (orderProduct: OrderProductDto) => {
        const product = await em.findOneBy(ProductEntity, { id: orderProduct.productId });

        if (!product) {
          throw new BadRequestException('Такого продукта не существует');
        }

        return product.price * orderProduct.quantity;
      }),
    ).then((prices: Array<number>) => prices.reduce((sum: number, price: number) => sum + price, 0));
  }

  public async orderProfit(recalculatedTotal: number, orderProducts: OrderProductDto[], em: EntityManager): Promise<number> {
    const totalUnitPrice = await Promise.all(
      orderProducts.map(async (orderProduct: OrderProductDto) => {
        const product = await em.findOneBy(ProductEntity, { id: orderProduct.productId });

        if (!product) {
          throw new BadRequestException('Такого продукта не существует');
        }

        return product.unitPrice * orderProduct.quantity;
      }),
    ).then((prices: Array<number>) => prices.reduce((sum: number, price: number) => sum + price, 0));
    return recalculatedTotal - totalUnitPrice;
  }

  public async getManagerOrders(restaurantId: number, status?: OrderStatus): Promise<Order[]> {
    const params: Array<string | number> = [restaurantId];
    let query = `
    SELECT o.id, o.profit, o.total, o.status, o.type, o.description, o."createdAt",
      json_agg(json_build_object('name',p.name,'price',op.price::varchar,'unitPrice',op."unitPrice"::varchar,'quantity', op.quantity)) as products,
      json_build_object('name',u.name, 'phone', u.phone ) as user,
      oa.address, oa.details AS "addressDetails" 
      FROM public.${TableName.ORDER} AS o
      INNER JOIN ${TableName.ORDER_PRODUCT} AS op  
      ON o.id = op."orderId"
      INNER JOIN public.${TableName.USER} as u
      ON u.id = o."userId"
      INNER JOIN ${TableName.PRODUCT} as p
      ON op."productId" = p.id 
      LEFT JOIN ${TableName.ORDER_ADDRESS} as oa
      ON o.id = oa."orderId"
    `;
    let whereClause = 'WHERE o."restaurantId"=$1 ';
    if (status) {
      if (!Object.values(OrderStatus).includes(status)) {
        throw new BadRequestException('Такого статуса не существует');
      }
      whereClause += 'AND o.status = $2 ';
      params.push(status);
    }
    query = `${query + whereClause}GROUP BY o.id, oa.address, oa.details,u.id`;
    return <Order[]> await this.orderRepository.manager.query(query, params);
  }

  public async acceptOrder(orderId: number): Promise<void> {
    const order = await this.orderRepository.findOneBy({ id: orderId });
    if (!order) {
      throw new NotFoundException('Такого заказа не существует');
    }
    if (order.status !== OrderStatus.IDLE) {
      throw new BadRequestException('Заказ уже принят или отменен');
    }
    order.status = OrderStatus.PENDING;
    await this.orderRepository.save(order);

    const orderEvent = new OrderStatusChangeEvent(order.id, order.status);
    this.eventEmitter.emit(EventType.ORDER_STATUS_CHANGE, orderEvent);
  }

  public async rejectOrder(orderId: number): Promise<void> {
    const order = await this.orderRepository.findOneBy({ id: orderId });
    if (!order) {
      throw new NotFoundException('Такого заказа не существует');
    }
    if (order.status !== OrderStatus.IDLE) {
      throw new BadRequestException('Заказ уже принят или отменен');
    }
    order.status = OrderStatus.CANCELED;
    await this.orderRepository.save(order);

    const orderEvent = new OrderStatusChangeEvent(order.id, order.status);
    this.eventEmitter.emit(EventType.ORDER_STATUS_CHANGE, orderEvent);
  }

  public async changeStatus(status: OrderStatus, orderId: number): Promise<void> {
    const order = await this.orderRepository.findOneBy({ id: orderId });
    if (!order) {
      throw new NotFoundException('Такого заказа не существует');
    }
    if (order.status === OrderStatus.COMPLETED) {
      throw new BadRequestException('Заказ уже завершен');
    }
    order.status = status;
    await this.orderRepository.save(order);

    const orderEvent = new OrderStatusChangeEvent(order.id, order.status);
    this.eventEmitter.emit(EventType.ORDER_STATUS_CHANGE, orderEvent);
  }

  public async getChefOrders(restaurantId: number, status?: ChefOrderStatus): Promise<Order[]> {
    const params: Array<string | number> = [restaurantId];

    let query = `
    SELECT o.id, o.profit, o.total, o.status, o.type, o.description, o."createdAt",
      json_agg(json_build_object('name',p.name,'price',op.price::varchar,'unitPrice',op."unitPrice"::varchar,'quantity', op.quantity)) as products,
      json_build_object('name',u.name, 'phone', u.phone ) as user,
      oa.address, oa.details AS "addressDetails"
      FROM public.${TableName.ORDER} AS o
      INNER JOIN ${TableName.ORDER_PRODUCT} AS op
      ON o.id = op."orderId"
      INNER JOIN public.${TableName.USER} as u
      ON u.id = o."userId"
      INNER JOIN ${TableName.PRODUCT} as p
      ON op."productId" = p.id
      LEFT JOIN ${TableName.ORDER_ADDRESS} as oa
      ON o.id = oa."orderId"
      WHERE o."restaurantId"=$1 
    `;

    let whereClause:string;
    const enumValues = Object.values(ChefOrderStatus);
    const enumSqlParams = this.utilService.generateSqlParams(enumValues, 2);

    if (status) {
      if (!this.chefStatus.includes(status)) {
        throw new BadRequestException('Данный статус неприемлим');
      }
      whereClause = ' AND o.status IN ($2) ';
      params.push(status);
    } else {
      whereClause = ` AND o.status IN (${enumSqlParams}) `;
      params.push(...enumValues);
    }

    query = `${query + whereClause}GROUP BY o.id, oa.address, oa.details, u.id`;
    return <Order[]> await this.orderRepository.manager.query(query, params);
  }

  public async chefChangeStatus(status: OrderStatus, orderId: number): Promise<void> {
    if (!this.chefStatus.includes(status)) {
      throw new BadRequestException('Передан недопустимый статус');
    }
    const order = await this.orderRepository.findOneBy({ id: orderId });
    if (!order) {
      throw new NotFoundException('Такого заказа не существует');
    }

    order.status = status;
    await this.orderRepository.save(order);

    const orderEvent = new OrderStatusChangeEvent(order.id, order.status);
    this.eventEmitter.emit(EventType.ORDER_STATUS_CHANGE, orderEvent);
  }

  public async getOrder(orderId: number): Promise<GetOrder> {
    const [order] = <GetOrder[]> await this.orderRepository.manager.query(
      `
      SELECT o.id, o.profit, o.total, o.status, o.type, o.description, o."createdAt",
        json_agg(json_build_object('name',p.name,'price',op.price::varchar,'unitPrice',op."unitPrice"::varchar,'quantity', op.quantity)) as products,
        json_build_object('name',u.name, 'phone', u.phone ) as user,
        oa.address, oa.details AS "addressDetails"
        FROM public.${TableName.ORDER} AS o
        INNER JOIN ${TableName.ORDER_PRODUCT} AS op
        ON o.id = op."orderId"
        INNER JOIN public.${TableName.USER} as u
        ON u.id = o."userId"
        INNER JOIN ${TableName.PRODUCT} as p
        ON op."productId" = p.id
        LEFT JOIN ${TableName.ORDER_ADDRESS} as oa
        ON o.id = oa."orderId"
        where o.id=$1
        GROUP BY o.id,u.id,oa.id
        `,
      [orderId],
    );
    return order;
  }
}
