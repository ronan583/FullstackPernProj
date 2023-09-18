import "reflect-metadata";
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
import { createConnection, getRepository } from "typeorm";
import { Post } from "./entities/Post";

// add property, augment express-session module
declare module "express-session" {
  interface SessionData {
    userId: number;
    user: User;
  }
}
// dbName: "pernrl",
// type: "postgresql",
// user: "postgres",
// password: "ronan583",
const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    database: "pernproj",
    username: "postgres",
    password: "ronan583",
    logging: true,
    synchronize: true,
    entities: [Post, User],
  });

  const repo = getRepository(Post)
  await repo.clear()

  const app = express();
  // Initialize client.
  // let redisClient = redis.createClient();
  app.use(
    cors({
      origin: ["https://studio.apollographql.com", "http://localhost:3000"],
      // origin: '*',
      // origin: 'http://localhost:4000/graphql',
      credentials: true,
    })
  );
  const redisClient = new Redis();
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
      },
      resave: false, // required: force lightweight session keep alive (touch)
      saveUninitialized: true, // recommended: only save session when data exists
      secret: "ill5bdf8jjq6t562hher;;f8",
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
  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

console.log("hello world hahaha ");
main().catch((err) => {
  console.error(err);
});
