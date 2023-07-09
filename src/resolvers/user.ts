import { User } from "../entities/User";
import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Query,
  Mutation,
  Resolver,
  ObjectType,
} from "type-graphql";
import argon2 from "argon2";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        errors: [
          { field: "username", message: "length must be greater than 2" },
        ],
      };
    }
    if (options.password.length <= 3) {
      return {
        errors: [
          { field: "password", message: "length must be greater than 3" },
        ],
      };
    }
    const hashedPassword = await argon2.hash(options.password);
    let newUser = new User();
    newUser.username = options.username;
    newUser.password = hashedPassword;
    const user = em.create(User, newUser);
    // const user = em.create(User, {
    //   username: options.username,
    //   password: hashedPassword,
    // });
    try {
      await em.persistAndFlush(user);
    } catch (err) {
      if (err.code === "23505" || err.detail.includes("already exists")) {
        //duplicated username error
        return { errors: [{ field: "username", message: "already taken" }] };
      }
    }
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    // let;
    const user = await em.findOne(User, { username: options.username });
    if (!user) {
      return {
        errors: [{ field: "username", message: "this username doesn't exist" }],
      };
    }
    const isValid = await argon2.verify(user.password, options.password);
    if (!isValid) {
      return {
        errors: [{ field: "password", message: "incorrect password" }],
      };
    }
    console.log(`user${user.id} logged in`);

    req.session.userId = user.id;
    console.log(req.session);

    return { user };
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() {  req, em }: MyContext) {
    if(!req.session.userId) {
      console.log('you are not logged in');      
      return null;
    }
    const user = await em.findOne(User, {id: req.session.userId});
    return user;
  }
}
