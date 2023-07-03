import path from "path";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import { User } from "./entities/User";


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
  entities: [Post, User],
  dbName: "pernrl",
  type: "postgresql",
  user: "postgres",
  password: "ronan583",
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0]

export default mikroConfig;