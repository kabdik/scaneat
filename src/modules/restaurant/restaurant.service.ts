import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as qrcode from 'qrcode';
import type { EntityManager, Repository } from 'typeorm';

import { TableName } from '@/common/enums/table';

import { CategoryService } from '../category/category.service';
import type { CategoryWithProduct } from '../category/interfaces/category.interface';
import { RestaurantOwnerService } from '../restaurant-owner/restaurant-owner.service';
import type { CreateRestaurantRequestBodyDto } from './dto/create-restaurant-request.body.dto';
import type { CreateRestaurantBodyDto } from './dto/create-restaurant.body.dto';
import type { UpdateRestaurantBodyDto } from './dto/update-restaurant.body.dto';
import { RestaurantEntity } from './entities/restaurant.entity';
import { VerificationStatus } from './enum/verification-status.enum';
import type { Restaurant, RestaurantWithOwner } from './interfaces/restaurant.interface';

@Injectable()
export class RestaurantService {
  constructor(
    private readonly categoryService:CategoryService,
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
    private readonly restaurantOwnerService: RestaurantOwnerService,
  ) {}

  public async getMenu(restaurantSlug:string): Promise<CategoryWithProduct[]> {
    const restaurant = await this.restaurantRepository.findOne({ where: { slug: restaurantSlug } });
    if (!restaurant) {
      throw new NotFoundException('There is no restaurant with such slug');
    }
    if (!restaurant.isActive) {
      throw new BadRequestException('The restaurant is not active');
    }
    const { id: restaurantId } = restaurant;
    return this.categoryService.getCategoriesWithProducts(restaurantId);
  }

  public async getRestaurantbySlug(restaurantSlug:string):Promise<Restaurant> {
    const restaurant = <Restaurant> await this.restaurantRepository.manager.query(`
      SELECT r.id, r.name, r.slug, r.phone, r."cityId", r.address, r.rating, r."hasTakeAway", r."hasDelivery",
      r."isActive", r."verificationStatus", r."photoId", p."originalUrl", p.thumbnails 
        FROM ${TableName.RESTAURANT} AS r 
        LEFT JOIN ${TableName.PHOTO} as p
        ON r."photoId" = p.id
        WHERE r.slug=$1 
    `, [restaurantSlug]);
    if (!restaurant) {
      throw new NotFoundException('There is no store with such slug');
    }
    return restaurant;
  }

  public async generateQR(restaurantId:number):Promise<Buffer> {
    const restaurant = await this.restaurantRepository.findOneBy({ id: restaurantId });
    if (!restaurant) {
      throw new NotFoundException('Такого ресторана не существует');
    }
    const url = `http://localhost:3001/restaurant/${restaurant.slug}/menu`;
    return qrcode.toBuffer(url);
  }

  public async getAll(userId:number, status?:VerificationStatus):Promise<Restaurant[]> {
    const params: Array<string | number> = [userId];
    let query = `
      SELECT r.id, r.name, r.slug, r.phone, r."cityId", r.address, r.rating, r."hasTakeAway", r."hasDelivery",
      r."isActive", r."verificationStatus", p."originalUrl", p.thumbnails 
        FROM ${TableName.RESTAURANT} AS r 
        INNER JOIN ${TableName.RESTAURANT_OWNER} AS ro 
        ON r.id=ro."restaurantId"
        LEFT JOIN ${TableName.PHOTO} as p
        ON r."photoId" = p.id
        WHERE ro."userId"=$1 
        `;
    if (status) {
      query += 'AND r."verificationStatus"=$2';
      params.push(status);
    }
    return <Promise<Restaurant[]>> this.restaurantRepository.query(query, params);
  }

  public async createRestaurantRequest({ restaurant: restaurantData, restaurantOwner }: CreateRestaurantRequestBodyDto):Promise<void> {
    return this.restaurantRepository.manager.transaction(async (em:EntityManager) => {
      const restaurant = await this.createRestaurant(restaurantData, em);

      await this.restaurantOwnerService.createRestaurantOwner({ ...restaurantOwner, restaurantId: restaurant.id }, em);
    });
  }

  public async createRestaurant(restaurantData:CreateRestaurantBodyDto, em?:EntityManager):Promise<Restaurant> {
    const entityManager = em || this.restaurantRepository.manager;

    if (await entityManager.findOne(RestaurantEntity, { where: { slug: restaurantData.slug } })) {
      throw new BadRequestException('this restaurant already exists');
    }

    return entityManager.save(RestaurantEntity, restaurantData);
  }

  public async getAllRestaurantRequests(verificationStatus?:VerificationStatus):Promise<RestaurantWithOwner[]> {
    const params:Array<VerificationStatus> = [];
    let query = `
      SELECT r.id, r.name, r.slug, r.phone, r."cityId", r.address, r.rating, r."hasTakeAway", r."hasDelivery",
      r."isActive", r."verificationStatus", p."originalUrl", p.thumbnails, 
      u.name AS "OwnerName" , u.surname AS "OwnerSurname", u.phone AS "OwnerPhone" 
        FROM ${TableName.RESTAURANT} AS r
        INNER JOIN ${TableName.RESTAURANT_OWNER} AS ro
        ON r.id=ro."restaurantId"
        INNER JOIN public.${TableName.USER} as u
        on ro."userId"=u.id
        LEFT JOIN ${TableName.PHOTO} as p
        ON r."photoId" = p.id 
        `;
    if (verificationStatus) {
      query += 'WHERE r."verificationStatus" = $1 ';
      params.push(verificationStatus);
    }
    return <Promise<RestaurantWithOwner[]>> this.restaurantRepository.manager.query(query, params);
  }

  public async verifyRestaurantRequest(restaurantId:number):Promise<void> {
    const restaurant = await this.restaurantRepository.findOne({ where: { id: restaurantId },
      relations: ['restaurantOwner'] });
    if (!restaurant) {
      throw new NotFoundException('There is no restaurant with this slug');
    }

    if (restaurant.verificationStatus !== 'pending') {
      throw new BadRequestException('The restaurant create request was already accepted');
    }
    restaurant.verificationStatus = VerificationStatus.ACCEPTED;
    await this.restaurantRepository.save(restaurant);
  }

  public async rejectRestaurantRequest(restaurantId:number):Promise<void> {
    const restaurant = await this.restaurantRepository.findOne({ where: { id: restaurantId },
      relations: ['restaurantOwner'] });
    if (!restaurant) {
      throw new NotFoundException('There is no restaurant with this slug');
    }

    if (restaurant.verificationStatus !== 'pending') {
      throw new BadRequestException('The restaurant create request was already accepted');
    }

    restaurant.verificationStatus = VerificationStatus.REJECTED;
    await this.restaurantRepository.save(restaurant);
  }

  public async updateRestaurant(restaurantId:number, data:UpdateRestaurantBodyDto):Promise<void> {
    const { affected } = await this.restaurantRepository.update(restaurantId, data);
    if (affected === 0) {
      throw new NotFoundException('Ресторана с таким id не существует');
    }
  }
}
