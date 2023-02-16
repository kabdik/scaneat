import path from 'path';

import { Injectable } from '@nestjs/common';
import { CountryCode, parsePhoneNumber } from 'libphonenumber-js';
import { v4 as uuid } from 'uuid';

import { TelegramConfig } from '@/config/telegram.config';

import type { ParsedPhoneNumber } from '../interfaces/phone';

@Injectable()
export class UtilService {
  public parsePhoneNumber(phone: string, countryCode: string): ParsedPhoneNumber {
    const phoneNumber = parsePhoneNumber(phone, <CountryCode>countryCode);

    if (!phoneNumber.isValid()) {
      throw new Error('Not a valid phone number');
    }

    return {
      countryCode,
      national: phoneNumber.nationalNumber,
      international: phoneNumber.number,
    };
  }

  public normalizeNumber(value: string | number): number {
    let number;
    if (typeof value === 'string') {
      number = parseFloat(value);
    } else {
      number = value;
    }

    return Math.round(number * 100) / 100;
  }

  public generateTgLink(orderId:number):string {
    const queryParam = Buffer.from(`orderId=${orderId}`, 'binary').toString('base64');
    return `https://t.me/${TelegramConfig.TELEGRAM_BOT_NAME}?start=${queryParam}`;
  }

  public generateRandomFileKey(file: Express.Multer.File, prefixDir: string): string {
    const fileExtName = path.extname(file.originalname);

    const randomName = uuid();

    let url = prefixDir.concat('/', `${randomName}${fileExtName}`);
    if (prefixDir.includes('/')) {
      url = url.replace('/', '');
    }
    return url;
    // return path.join(prefixDir, `${randomName}${fileExtName}`);
  }

  public generateSqlParams(array: Array<any>, offset:number = 1): string {
    return array.map((_: any, ind: number) => `$${(offset + ind)}`).join(',');
  }

  // TODO: refactor, move to whatsapp (DI circular dep error)
}
