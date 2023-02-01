import { CategoryEntity } from '../category/entities/category.entity';
import { CityEntity } from '../cities/city.entity';
import { OrderAddressEntity } from '../order/entities/order-address.entity';
import { OrderProductEntity } from '../order/entities/order-product.entity';
import { OrderEntity } from '../order/entities/order.entity';
import { PhotoEntity } from '../photo/entities/photo.entity';
import { ProductEntity } from '../product/entitites/product.entity';
import { RestaurantOwnerEntity } from '../restaurant-owner/entities/restaurant-owner.entity';
import { RestaurantStaffEntity } from '../restaurant-staff/entitites/restaurant-staff.entity';
import { RestaurantEntity } from '../restaurant/entities/restaurant.entity';
import { UserEntity } from '../user/entities/user.entity';

export const ADMINJS_RESOURCES = [
  RestaurantEntity,
  CityEntity,
  UserEntity,
  ProductEntity,
  CategoryEntity,
  RestaurantStaffEntity,
  RestaurantOwnerEntity,
  PhotoEntity,
  OrderEntity,
  OrderProductEntity,
  OrderAddressEntity,
];
