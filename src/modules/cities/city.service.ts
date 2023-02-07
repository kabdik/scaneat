import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { CityEntity } from './city.entity';
import type { City } from './city.interface';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
  ) {}

  public async getCityById(cityId: number): Promise<City> {
    const city = await this.cityRepository.findOneBy({ id: cityId });
    if (!city) {
      throw new NotFoundException('Не существует города с таким id');
    }
    return city;
  }

  public async getAll(): Promise<City[]> {
    return this.cityRepository.find();
  }
}
