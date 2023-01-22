import { CategoryEntity } from '../category/entities/category.entity';
import { CityEntity } from '../cities/city.entity';
import { ProductEntity } from '../product/entitites/product.entity';
import { RestaurantEntity } from '../restaurant/entities/restaurant.entity';
import { UserEntity } from '../user/entities/user.entity';

export const ADMINJS_RESOURCES = [
  RestaurantEntity,
  CityEntity,
  UserEntity,
  ProductEntity,
  CategoryEntity,
];
