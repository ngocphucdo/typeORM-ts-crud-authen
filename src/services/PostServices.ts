import { Post } from "./../entity/Post";
import { getRepository } from "typeorm";

class PostService {
  private resource;
  constructor(post = Post) {
    this.resource = getRepository(post);
  }
  public createPostService = async (data: Partial<Post>) => {
    return this.resource.save(data);
  };

  public getAllPostService = async () => {
    return this.resource.find({
      select: ["id", "title", "content", "createAt", "tag", "user_id"],
    });
  };
}

export default PostService;
