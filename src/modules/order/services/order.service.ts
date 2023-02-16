import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { TableName } from '@/common/enums/table';
import { ProductEntity } from '@/modules/product/entitites/product.entity';
import { RestaurantEntity } from '@/modules/restaurant/entities/restaurant.entity';

import { UserService } from '../../user/user.service';
import type { CreateOrderBodyDto, OrderProductDto } from '../dto/create-order.body.dto';
import { OrderEntity } from '../entities/order.entity';
import { ChefOrderStatus, OrderStatus } from '../enum/order-status.enum';
import { OrderType } from '../enum/order-type.enum';
import type { Order } from '../interfaces/order.interface';
import { OrderAddressService } from './order-address.service';
import { OrderProductService } from './order-product.service';

@Injectable()
export class OrderService {
  private chefStatus:Array<string> = ['pending', 'processing', 'ready'];
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly userService: UserService,
    private readonly orderProductService: OrderProductService,
    private readonly orderAddressService: OrderAddressService,
  ) {}

  public async createOrder({ name, phone, ...data }: CreateOrderBodyDto, restaurantId: number): Promise<void> {
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

  public async acceptOrder(orderId:number): Promise<void> {
    const order = await this.orderRepository.findOneBy({ id: orderId });
    if (!order) {
      throw new NotFoundException('Такого заказа не существует');
    }
    if (order.status !== OrderStatus.IDLE) {
      throw new BadRequestException('Заказ уже принят или отменен');
    }
    order.status = OrderStatus.PENDING;
    await this.orderRepository.save(order);
  }

  public async rejectOrder(orderId:number): Promise<void> {
    const order = await this.orderRepository.findOneBy({ id: orderId });
    if (!order) {
      throw new NotFoundException('Такого заказа не существует');
    }
    if (order.status !== OrderStatus.IDLE) {
      throw new BadRequestException('Заказ уже принят или отменен');
    }
    order.status = OrderStatus.CANCELED;
    await this.orderRepository.save(order);
  }

  public async changeStatus(status:OrderStatus, orderId:number): Promise<void> {
    const order = await this.orderRepository.findOneBy({ id: orderId });
    if (!order) {
      throw new NotFoundException('Такого заказа не существует');
    }

    order.status = status;
    await this.orderRepository.save(order);
  }

  public async getChefOrders(restaurantId:number, status?:ChefOrderStatus): Promise<Order[]> {
    const params: Array<string | number> = [restaurantId];
    const enumValues = Object.values(ChefOrderStatus).map((value:string) => `'${value}'`).join(', ');

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
    let whereClause = `WHERE o."restaurantId"=$1 
                      AND o.status IN (${enumValues} ) `;
    if (status) {
      if (!this.chefStatus.includes(status)) {
        throw new BadRequestException('Такого статуса не существует');
      }
      whereClause += 'AND o.status = $2 ';
      params.push(status);
    }
    query = `${query + whereClause}GROUP BY o.id, oa.address, oa.details, u.id`;
    return <Order[]> await this.orderRepository.manager.query(query, params);
  }

  public async chefChangeStatus(status:OrderStatus, orderId:number): Promise<void> {
    if (!this.chefStatus.includes(status)) {
      throw new BadRequestException('Передан недопустимый статус');
    }
    const order = await this.orderRepository.findOneBy({ id: orderId });
    if (!order) {
      throw new NotFoundException('Такого заказа не существует');
    }

    order.status = status;
    await this.orderRepository.save(order);
  }
}
