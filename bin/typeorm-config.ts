/// <reference types="../typings/global" />
import { DataSource, DataSourceOptions } from 'typeorm';
import { DbConfig } from '@/config/db.config';

const ormconfig = (): DataSource => {
  const config: DataSourceOptions = {
    type: 'postgres',
    host: DbConfig.DB_HOST,
    port: DbConfig.DB_PORT,
    database: DbConfig.DB_NAME,
    username: DbConfig.DB_USERNAME,
    password: DbConfig.DB_PASSWORD,
    entities: [`${__dirname}/../src/modules/**/*.entity.{js,ts}`],
    migrations: [`${__dirname}/../src/db/typeorm-migrations/**/*.{js,ts}`],
  }

  return new DataSource(config);
};

export default ormconfig();
