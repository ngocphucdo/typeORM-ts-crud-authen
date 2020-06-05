import { Post } from "./../entity/Post";
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import PostService from "../services/PostServices";

class PostController {
  static getAll = async (req: Request, res: Response) => {
    const postServiceObj = new PostService();
    res.status(200).send(await postServiceObj.getAllPostService());
  };

  static getOneById = async (req: Request, res: Response) => {
    const userPostObj = new PostService();

    try {
      res.status(200).send(await userPostObj.getOnePostService(req));
    } catch (error) {
      res.status(404).send({ message: "Post not found" });
      return;
    }
  };

  static newOne = async (req: Request, res: Response) => {
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
    const postServiceObj = new PostService();

    postServiceObj.createPostService(post);

    // await postRepository.save(post);

    res.status(201).send({ message: "Post created" });
  };

  static editOneById = async (req: Request, res: Response) => {
    const postServiceObj = new PostService();
    const idOfUpdater = res.locals.jwtPayload.userId;
    //Find id exit or not
    const post = await postServiceObj.findPostById(req, res);
    const { title, content, tag } = req.body;

    //Check match
    if (idOfUpdater !== post.user_id) {
      return res.status(401).send({
        message: "Only the owner can edit post",
      });
    }

    //Valdate
    post.title = title;
    post.content = content;
    post.tag = tag;
    const errors = await validate(post);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    //Save post
    try {
      await postServiceObj.editOneByIdPostService(post);
    } catch (error) {
      res.status(409).send({ message: "Conflict - This title already exited" });
      return;
    }
    res.status(200).send({ message: "Post updated" });
  };

  static deleteOneById = async (req: Request, res: Response) => {
    const idOfUpdater = res.locals.jwtPayload.userId;
    const postServiceObj = new PostService();
    const postRepository = getRepository(Post);

    const id = req.params.id;
    //Check id in id
    const post = await postServiceObj.findPostById(req, res);

    //Check match id
    if (idOfUpdater !== post.user_id) {
      return res.status(401).send({
        message: "Only the owner can delete post",
      });
    }

    postRepository.delete(id);
    res.status(200).send({
      message: "Deleted",
    });
  };
}

export default PostController;
