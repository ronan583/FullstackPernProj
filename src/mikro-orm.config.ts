import path from "path";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM, Options } from "@mikro-orm/core";


// const mikroConfig: Options = {
//   entities: [Post],
//   dbName: "pernrl",
//   type: "postgresql",
//   user: "postgres",
//   password: "ronan583",
//   debug: !__prod__,
// };

const mikroConfig = {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.ts$/,
  },
  entities: [Post],
  dbName: "pernrl",
  type: "postgresql",
  user: "postgres",
  password: "ronan583",
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0]

export default mikroConfig;