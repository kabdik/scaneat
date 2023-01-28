import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as qrcode from 'qrcode';
import type { EntityManager, Repository } from 'typeorm';

import { CategoryService } from '../category/category.service';
import type { CategoryWithProduct } from '../category/interfaces/category.interface';
import { RestaurantOwnerService } from '../restaurant-owner/restaurant-owner.service';
import type { CreateRestaurantRequestBodyDto } from './dto/create-restaurant-request.body.dto';
import type { CreateRestaurantBodyDto } from './dto/create-restaurant.body.dto';
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
      throw new BadRequestException('There is no restaurant with such slug');
    }

    const { id: restaurantId } = restaurant;
    return this.categoryService.getCategoriesWithProducts(restaurantId);
  }

  public async getRestaurantbySlug(restaurantSlug:string):Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({ where: { slug: restaurantSlug } });
    if (!restaurant) {
      throw new BadRequestException('There is no store with such slug');
    }
    return restaurant;
  }

  public async generateQR(restaurantSlug:string):Promise<Buffer> {
    const url = `http://localhost:3001/restaurant/${restaurantSlug}/menu`;
    return qrcode.toBuffer(url);
  }

  public async getAll():Promise<Restaurant[]> {
    return this.restaurantRepository.find();
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

  public async getAllRestaurantRequests(verificationStatus:VerificationStatus):Promise<RestaurantWithOwner[]> {
    return <RestaurantWithOwner[]> await this.restaurantRepository.find({
      where: { verificationStatus },
      relations: ['restaurantOwner'] });
  }

  public async verifyRestaurantRequest(restaurantSlug:string):Promise<void> {
    const restaurant = await this.restaurantRepository.findOne({ where: { slug: restaurantSlug },
      relations: ['restaurantOwner'] });
    if (!restaurant) {
      throw new BadRequestException('There is no restaurant with this slug');
    }

    restaurant.verificationStatus = VerificationStatus.ACCEPTED;
    await this.restaurantRepository.save(restaurant);
  }
}
