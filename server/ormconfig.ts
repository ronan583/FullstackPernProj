// import * as dotenv from 'dotenv';
// import { cwd, env } from 'process';
// import { DataSource } from 'typeorm';

// dotenv.config();

// export const dataSource = new DataSource({
//   type: 'postgres',
//   host: "localhost",
//   port: 5432,
//   username: "postgres",
//   password: "ronan583",
//   database: "pernproj2",
//   entities: ["dist/entities/*.js"],
//   migrations:  ["dist/migrations/*.js"],
//   migrationsTableName: 'migrations',
//   synchronize: false,
//   dropSchema: false,
// });
// import { DataSource } from 'typeorm';

// const dataSource = new DataSource({
//   type: 'postgres',
//   host: 'localhost',
//   port: 5432,
//   username: 'postgres',
//   password: 'ronan583',
//   database: 'pernproj',
//   entities: ["dist/entities/*.js"],
//   migrations: ["dist/migrations/*.js"],
// });

// export default dataSource;
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

dotenv.config();

const configs: PostgresConnectionOptions = {
  type: 'postgres',
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "ronan583",
  database: "pernproj2",
  entities: ["dist/entities/*.js"],
  migrations: ["dist/migrations/*.js"],
};

export default new DataSource(configs);
