import "reflect-metadata";
import "dotenv-safe/config";
import { COOKIE_NAME, __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import connectRedis from "connect-redis";
import session from "express-session";
import Redis from "ioredis";
import { MyContext } from "./types";
import cors from "cors";
import { User } from "./entities/User";
import { createConnection } from "typeorm";
import { Post } from "./entities/Post";
import path = require("path");
import { Updoot } from "./entities/Updoot";

// add property, augment express-session module
declare module "express-session" {
  interface SessionData {
    userId: number;
    user: User;
  }
}
const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    // database: "pernproj",
    // username: "postgres",
    // password: "ronan583",
    // don't need all above, when using .env
    url: process.env.DATABASE_URL,
    logging: true,
    // synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Post, User, Updoot],
  });
  //
  await conn.runMigrations();
  // await Post.delete({});
  // await sqlOpts.deleteAllPosts();
  // await sqlOpts.deleteAllUsers();

  const app = express();
  // Initialize client.
  app.set("proxy", 1);
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      // origin: '*',
      // origin: 'http://localhost:4000/graphql',
      credentials: true,
    })
  );
  const redisClient = new Redis(process.env.REDIS_URL);
  const RedisStore = connectRedis(session);
  // Initialize store.
  let redisStore = new RedisStore({
    client: redisClient as any,
    disableTouch: true,
    disableTTL: true,
  });
  // Initialize sesssion storage.
  app.use(
    session({
      name: COOKIE_NAME,
      store: redisStore,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 5, // ten years
        httpOnly: false,
        // sameSite: "none",
        // sameSite: "strict",
        // sameSite: "lax",
        // secure: false, // cookie only word in https
        // secure: true,   // cookie only word in https
        // secure: __prod__,
        domain: __prod__ ? ".littlemiaooow" : undefined,
      },
      resave: false, // required: force lightweight session keep alive (touch)
      saveUninitialized: true, // recommended: only save session when data exists
      secret: process.env.SESSION_SECRET,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({
      req,
      res,
      redis: redisClient,
    }),
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });
  app.listen(parseInt(process.env.PORT), () => {
    console.log(`server started on localhost:${process.env.PORT}`);
  });
};

console.log("hello world hahaha ");
main().catch((err) => {
  console.error(err);
});
