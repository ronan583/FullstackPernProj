import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { COOKIE_NAME, __prod__ } from "./constants";
import mikroConfig from "./mikro-orm.config";
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
import { sendEmail } from "./utils/sendEmail";

// add property, augment express-session module
declare module "express-session" {
  interface SessionData {
    userId: number;
    user: User;
  }
}

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  // const obj = { title: "my first post" } as { createdAt: string | Date; updatedAt: string | Date; title: string; };
  // const em = orm.em.fork();

  // const post = em.create(Post, obj);
  // await em.persistAndFlush(post);
  // const posts = await em.find(Post, {});
  // console.log(posts);

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
  // const redisclient = Redis.createClient();
  const redisClient = new Redis();
  // redisClient.connect().catch(console.error);

  const RedisStore = connectRedis(session);
  // const RedisStore = connectRedis.default;

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

  // app.get('/', (_, res) => {
  //   res.send('Hello!');
  // })
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({
      em: orm.em.fork(),
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
