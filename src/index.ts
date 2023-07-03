import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

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
  // app.get('/', (_, res) => {
  //   res.send('Hello!');
  // })
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em.fork() }),
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

console.log("hello world hahaha ");
main().catch((err) => {
  console.error(err); 
});
