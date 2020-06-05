import { Request, Response } from "express";
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

  public getOnePostService = async (req: Request) => {
    const id: string = req.params.id;
    return this.resource.findOneOrFail(id, {
      select: ["id", "title", "content", "createAt", "tag", "user_id"],
    });
  };

  public editOneByIdPostService = async (post: Post) => {
    await this.resource.save(post);
  };

  public findPostById = async (req: Request, res: Response) => {
    const id = req.params.id;
    let post;
    try {
      post = await this.resource.findOneOrFail(id);
    } catch (error) {
      res.status(404).send({ message: "Post not found" });
    }
    return post;
  };
}

export default PostService;
