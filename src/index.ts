import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import "reflect-metadata";
import { Post } from "./entities/Post";
import mikroConfig from "./mikro-orm.config"

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);

  console.log("-----sql1-----");
  const post = orm.em.create(Post, { title: "my first post" });
  await orm.em.persistAndFlush(post);
  console.log("-----sql2-----");

  await orm.em.nativeInsert(Post, { title: " my second post" });
};

console.log("hello world hahaha ");
main().catch((err) => {
  console.error(err);
});
