import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { RestaurantCategoryGuard } from '@/modules/auth/guards/category.guard';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RestaurantGuard } from '@/modules/auth/guards/restaurant.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';

export const RestauranOwner = ():ReturnType<typeof applyDecorators> => applyDecorators(
  SetMetadata('roles', ['restaurantOwner']),
  UseGuards(JwtAuthGuard, RolesGuard, RestaurantGuard, RestaurantCategoryGuard),
);
