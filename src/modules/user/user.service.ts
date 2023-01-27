import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { EntityManager, Repository } from 'typeorm';

import { SendgridService } from '@/common/providers/sendgrid.service';

import type { CreateUserBodyDto } from './dto/create-user.body.dto';
import { UserEntity } from './entities/user.entity';
import type { User } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    private readonly sendgrid:SendgridService,
  ) {}

  public async getUserByEmail(email:string):Promise<User | null> {
    return <Promise<User | null>> this.userRepository.findOne({ where: { email } });
  }

  public async createUser(data :CreateUserBodyDto, em?:EntityManager):Promise<User> {
    const entityManager = em || this.userRepository.manager;
    if (await this.getUserByEmail(data.email)) {
      throw new BadRequestException('There already exists user with such email');
    }

    const user = <User> entityManager.create(UserEntity, data);
    if (user.password) {
      user.password = await this.hashPassword(user.password);
    } else {
      const randomPassword = Math.random().toString(36).slice(-8);
      user.password = await this.hashPassword(randomPassword);

      await this.sendgrid.sendPassword(randomPassword, data.email);
    }
    return entityManager.save(UserEntity, user);
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hash(password, salt).then((hash: string) => hash);
  }
}
