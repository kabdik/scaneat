import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as qrcode from 'qrcode';
import type { Repository } from 'typeorm';

import { CategoryService } from '../category/category.service';
import type { CategoryWithProduct } from '../category/interfaces/category.interface';
import { RestaurantEntity } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    private readonly categoryService:CategoryService,
    @InjectRepository(RestaurantEntity) private readonly restaurantRepository: Repository<RestaurantEntity>,
  ) {}

  public async getMenu(restaurantSlug:string): Promise<CategoryWithProduct[]> {
    const restaurant = await this.restaurantRepository.findOne({ where: { slug: restaurantSlug } });
    if (!restaurant) {
      throw new BadRequestException('There is no restaurant with such slug');
    }

    const { id: restaurantId } = restaurant;
    return this.categoryService.getCategoriesWithProducts(restaurantId);
  }

  public async generateQR(restaurantSlug:string):Promise<Buffer> {
    const url = `http://localhost:3001/restaurant/${restaurantSlug}/menu`;
    return qrcode.toBuffer(url);
  }
}
