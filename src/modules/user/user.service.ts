import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { EntityManager, Repository } from 'typeorm';

import { SendgridService } from '@/common/providers/sendgrid.service';

import type { CreateClientBodyDto } from './dto/create-client.body.dto';
import type { CreateUserBodyDto } from './dto/create-user.body.dto';
import { UserEntity } from './entities/user.entity';
import { UserRoleType } from './enums/user-role.enum';
import type { User } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    private readonly sendgrid: SendgridService,
  ) {}

  public async getUserByEmail(email: string): Promise<User | null> {
    return <Promise<User | null>> this.userRepository.findOne({ where: { email } });
  }

  public async createUser(data: CreateUserBodyDto, em?: EntityManager): Promise<User> {
    const entityManager = em || this.userRepository.manager;
    if (await this.getUserByEmail(data.email)) {
      throw new BadRequestException('There already exists user with such email');
    }

    let user = <User>entityManager.create(UserEntity, data);

    const randomPassword = Math.random().toString(36).slice(-8);
    user.password = await this.hashPassword(randomPassword);

    user = await entityManager.save(UserEntity, user);

    await this.sendgrid.sendPassword(randomPassword, data.email);
    return user;
  }

  public async createClient(data: CreateClientBodyDto, em?: EntityManager): Promise<User> {
    const entityManager = em || this.userRepository.manager;

    const client = await entityManager.findOne(UserEntity, {
      where: {
        phone: data.phone,
        role: UserRoleType.USER,
      },
    });

    if (client) {
      return client;
    }

    return entityManager.save(UserEntity, data);
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hash(password, salt).then((hash: string) => hash);
  }
}
