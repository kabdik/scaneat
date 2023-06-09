import { BaseEntity } from '@/common/entities/base.entity';
import { TableName } from '@/common/enums/table';
import { CityEntity } from '@/modules/cities/city.entity';
import { PhotoEntity } from '@/modules/photo/entities/photo.entity';
import { RestaurantOwnerEntity } from '@/modules/restaurant-owner/entities/restaurant-owner.entity';
import type { RestaurantOwner } from '@/modules/restaurant-owner/interfaces/restaurant-owner.intereface';
import { Check, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { VerificationStatus } from '../enum/verification-status.enum';
import type { Restaurant } from '../interfaces/restaurant.interface';

@Entity(TableName.RESTAURANT)
export class RestaurantEntity extends BaseEntity implements Restaurant {
  @Column('varchar')
  name!: string;

  @Column('varchar', { unique: true })
  slug!: string;

  @Column('text', { nullable: true })
  phone!: string | null;

  @Column('int')
  cityId!: number;

  @Column('int', { nullable:true})
  restaurantOwnerId!: number | null; 
  
  @Column('text', { nullable: true })
  address!: string | null;

  @Column('numeric', { default: 0.0, scale: 2, precision: 3 })
  @Check(`"rating" >= 0.00 AND "rating" <= 5.00`)
  rating!: number;

  @Column('boolean', { default: true })
  hasTakeAway!: boolean;

  @Column('boolean', { default: false })
  hasDelivery!: boolean;

  @Column('boolean', { default: false })
  isActive!: boolean;

  @Column('enum', { enum: VerificationStatus, default: VerificationStatus.PENDING })
  verificationStatus!: VerificationStatus;

  @Column('int', { nullable: true })
  photoId!: number | null;

  @ManyToOne(() => CityEntity, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'cityId' })
  city?: CityEntity;

  @ManyToOne(() => PhotoEntity, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'photoId' })
  photo?: PhotoEntity;

  @ManyToOne(() => RestaurantOwnerEntity,{
    onDelete:'SET NULL',
    onUpdate:'CASCADE'
  })
  @JoinColumn({name:'restaurantOwnerId'})
  restaurantOwner!: RestaurantOwner;
}
