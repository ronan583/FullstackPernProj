import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import "reflect-metadata";
import { Post } from "./entities/Post";
import mikroConfig from "./mikro-orm.config"

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();
  console.log("-----sql1-----");
  const obj = { title: "my first post" } as { createdAt: string | Date; updatedAt: string | Date; title: string; };
  const em = orm.em.fork();

  const post = em.create(Post, obj);
  await em.persistAndFlush(post);
  // console.log("-----sql2-----");

  // await em.nativeInsert(Post, { title: " my second post" });

  const posts = await em.find(Post, {});
  console.log(posts); 
  
};
 
console.log("hello world hahaha ");
main().catch((err) => {
  console.error(err);
});
