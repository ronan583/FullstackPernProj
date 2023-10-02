// import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./User";
import { Post } from "./Post";

// many to many relationship
// m to n, users < - > posts
// user -> join table <- posts
// user -> update <- posts
// @ObjectType()
@Entity()
export class Updoot extends BaseEntity{
  // @Field()
  @Column({type: 'int'})
  value: number;

  // @Field()
  @PrimaryColumn()
  userId: number;

  // @Field(() => User)
  @ManyToOne(() => User, (user) => user.updoots)
  user: User;

  // @Field()
  @PrimaryColumn()
  postId: number;

  // @Field(() => Post)
  @ManyToOne(() => Post, (post) => post.updoots, {
    onDelete: "CASCADE"
  })
  post: Post;
}