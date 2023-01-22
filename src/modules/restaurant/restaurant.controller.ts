import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';

import type { CategoryWithProduct } from '../category/interfaces/category.interface';
import { RestaurantService } from './restaurant.service';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurant:RestaurantService) {}

  @Get(':restaurantSlug/menu')
  public async getMenu(@Param('restaurantSlug') restaurantSlug: string): Promise<CategoryWithProduct[]> {
    return this.restaurant.getMenu(restaurantSlug);
  }

  @Get(':restaurantSlug/qr')
  public async generateQR(@Param('restaurantSlug') restaurantSlug:string, @Res() res:Response): Promise<void> {
    const qrCode = await this.restaurant.generateQR(restaurantSlug);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'attachment; filename=qr-code.png');
    res.send(qrCode);
  }
}
