import { Post } from "src/entities/Post";

const delPosts = async () => {
  await Post.delete({});
};

export { delPosts };
