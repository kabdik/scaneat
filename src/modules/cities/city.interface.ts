import type { BaseEntityStatic } from '@/common/entities/base.entity';

export interface City extends BaseEntityStatic {
  name: string;
  slug: string;
}
