import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { Response } from 'express';
import moment from 'moment';

import { ServerConfig } from '@/config/server.config';

import { UserService } from '../user/user.service';
import type { JwtPayload, JwtSign, UserLogin, UserPayload } from './auth.interface';
import type { LoginBodyDto } from './dto/login.body.dto';

@Injectable()
export class AuthService {
  constructor(private jwt:JwtService, private userService:UserService) {}

  public async login(res:Response, { email, password }:LoginBodyDto):Promise<void> {
    const user = <UserLogin> await this.userService.getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Wrong email or password');
    }

    this.setAuthCookie(res, { userId: user.id, role: user.role });
  }

  public setAuthCookie(res:Response, user: UserPayload): void {
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

  public jwtSign(data:UserPayload): JwtSign {
    const payload: JwtPayload = { sub: data.userId, role: data.role };
    return {
      access_token: this.jwt.sign(payload),
      refresh_token: this.getRefreshToken(payload.sub),
    };
  }

  public getRefreshToken(sub:number): string {
    return this.jwt.sign({ sub }, {
      secret: ServerConfig.JWT_REFRESH_SECRET,
      expiresIn: `${ServerConfig.JWT_SECRET_TTL_IN_DAYS} days`,
    });
  }
}
