import { Post } from "../entities/Post";
import { User } from "../entities/User";

const deleteAllPosts = async () => {
  await Post.delete({});
};

const deleteAllUsers = async () => {
  await User.delete({});
};

const sqlOpts = { deleteAllUsers, deleteAllPosts };

export default sqlOpts;
