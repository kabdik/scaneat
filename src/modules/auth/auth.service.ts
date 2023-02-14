import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectEntityManager } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import type { Response } from 'express';
import moment from 'moment';
import type { EntityManager } from 'typeorm';

import { ServerConfig } from '@/config/server.config';

import { RestaurantOwnerEntity } from '../restaurant-owner/entities/restaurant-owner.entity';
import type { RestaurantOwner } from '../restaurant-owner/interfaces/restaurant-owner.intereface';
import { RestaurantStaffEntity } from '../restaurant-staff/entitites/restaurant-staff.entity';
import { StaffRoleEntity } from '../restaurant-staff/entitites/staff-role.entity';
import type { RestaurantStaff } from '../restaurant-staff/interfaces/restaurant-staff.interface';
import type { StaffRole } from '../restaurant-staff/interfaces/staff-role.interface';
import { UserRoleType } from '../user/enums/user-role.enum';
import { UserService } from '../user/user.service';
import type { JwtPayload, JwtSign, UserLogin, UserPayload } from './auth.interface';
import type { LoginBodyDto } from './dto/login.body.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectEntityManager()
    private em: EntityManager,
    private jwt: JwtService,
    private userService: UserService,
  ) {}

  public async login(res: Response, { email, password }: LoginBodyDto): Promise<void> {
    const user = <UserLogin> await this.userService.getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Wrong email or password');
    }

    const userPayload: UserPayload = {
      userId: user.id,
      role: user.role,
    };
    let staffRole:StaffRole;
    if (user.role === UserRoleType.RESTAURANT_OWNER) {
      const { id: restaurantOwnerId } = <RestaurantOwner> await this.em.findOneBy(RestaurantOwnerEntity, { userId: user.id });
      userPayload.restaurantOwnerId = restaurantOwnerId;
    } else {
      const restaurantStaff = <RestaurantStaff> await this.em.findOneBy(RestaurantStaffEntity, { userId: user.id });
      userPayload.restaurantStaffId = restaurantStaff.id;
      staffRole = <StaffRole> await this.em.findOneBy(StaffRoleEntity, { restaurantStaffId: restaurantStaff.id });
      if (user.role === UserRoleType.MANAGER) {
        userPayload.managerId = staffRole.id;
      } else if (user.role === UserRoleType.CHEF) {
        userPayload.chefId = staffRole.id;
      }
    }

    this.setAuthCookie(res, userPayload);
  }

  public setAuthCookie(res: Response, user: UserPayload): void {
    const token = this.jwtSign(user);

    const cookieOptions = {
      httpOnly: true,
      secure: ServerConfig.JWT_COOKIE_SECURE,
      expires: moment().add(1, 'year').toDate(),
    };

    res.cookie('access_token', token.access_token, cookieOptions);
    res.cookie('refresh_token', token.refresh_token, cookieOptions);
    res.cookie('user_id', user.userId, cookieOptions);
    res.cookie('user_role', user.role, cookieOptions);
  }

  public jwtSign({ userId, ...data }: UserPayload): JwtSign {
    const payload = <JwtPayload> {
      sub: userId,
      ...data,
    };

    return {
      access_token: this.jwt.sign(payload),
      refresh_token: this.getRefreshToken(payload.sub),
    };
  }

  public getRefreshToken(sub: number): string {
    return this.jwt.sign(
      { sub },
      {
        secret: ServerConfig.JWT_REFRESH_SECRET,
        expiresIn: `${ServerConfig.JWT_SECRET_TTL_IN_DAYS} days`,
      },
    );
  }
}
