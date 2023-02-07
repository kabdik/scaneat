import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import type { City } from './city.interface';
import { CityService } from './city.service';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @ApiOperation({ summary: 'Get all cities' })
  @Get()
  public async getCities(): Promise<City[]> {
    return this.cityService.getAll();
  }

  @ApiOperation({ summary: 'Get city by id' })
  @Get('/:cityId')
  public async getCityById(@Param('cityId') cityId: number): Promise<City> {
    return this.cityService.getCityById(cityId);
  }
}
