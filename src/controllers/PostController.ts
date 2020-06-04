import { Post } from "./../entity/Post";
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { User } from "../entity/User";

class PostController {
  static getAll = async (req: Request, res: Response) => {
    const postRepository = getRepository(Post);
    const posts = await postRepository.find({
      select: ["id", "title", "content", "createAt", "tag", "user_id"],
    });
    res.send(posts);
  };

  static getOneById = async (req: Request, res: Response) => {
    const id: string = req.params.id;

    const postRepository = getRepository(Post);
    try {
      const post = await postRepository.findOneOrFail(id, {
        select: ["id", "title", "content", "createAt", "tag", "user_id"],
      });
      res.status(200).send(post);
    } catch (error) {
      res.status(404).send({ message: "Post not found" });
      return;
    }
  };

  static newOne = async (req: Request, res: Response) => {
    const postRepository = getRepository(Post);
    let { title, content, tag } = req.body;

    const idOfPoster = res.locals.jwtPayload.userId;
    let post = new Post();
    post.title = title;
    post.content = content;
    post.tag = tag;
    post.user_id = idOfPoster;

    const errors = await validate(post);
    if (errors.length > 0) {
      res.status(400).send(errors[0].constraints);
      return;
    }
    await postRepository.save(post);

    res.status(201).send({ message: "Post created" });
  };

  static editOneById = async (req: Request, res: Response) => {
    const idOfUpdater = res.locals.jwtPayload.userId;
    const id = req.params.id;
    const postRepository = getRepository(Post);
    let post;
    try {
      post = await postRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send({ message: "Post not found" });
      return;
    }
    const { title, content, tag } = req.body;

    if (idOfUpdater !== post.user_id) {
      console.log(idOfUpdater);
      console.log(post.user_id);
      return res.status(401).send({
        message: "Only the owner can edit post",
      });
    }

    post.title = title;
    post.content = content;
    post.tag = tag;
    const errors = await validate(post);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    try {
      await postRepository.save(post);
    } catch (error) {
      res.status(409).send({ message: "Conflict - This title already exited" });
      return;
    }
    res.status(200).send({ message: "Post updated" });
  };

  static deleteOneById = async (req: Request, res: Response) => {
    const idOfUpdater = res.locals.jwtPayload.userId;
    const postRepository = getRepository(Post);
    let post;
    if (idOfUpdater !== post.user_id) {
      console.log(idOfUpdater);
      console.log(post.user_id);
      return res.status(401).send({
        message: "Only the owner can delete post",
      });
    }
    const id = req.params.id;

    try {
      post = await postRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send({ message: "Post not found" });
      return;
    }

    postRepository.delete(id);
    res.status(200).send({
      message: "Deleted",
    });
  };
}

export default PostController;
