import { User } from "./../entity/User";
import { validate } from "class-validator";
import { getRepository } from "typeorm";
import { Request, Response } from "express";
import UserService from "../services/UserServices";

class UserController {
  static getAll = async (req: Request, res: Response) => {
    const userServiceObj = new UserService();
    res.status(200).send(await userServiceObj.getAllUserService());
  };

  static getOneById = async (req: Request, res: Response) => {
    const userServiceObj = new UserService();
    try {
      res
        .status(200)
        .send(await userServiceObj.getOneByIdUserService(req, res));
    } catch (error) {
      res.status(404).send({ message: "User not found" });
      return;
    }
  };

  static newOne = async (req: Request, res: Response) => {
    let { email, name, password } = req.body;
    let user = new User();
    user.email = email;
    user.name = name;
    user.password = password;

    //Validate
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors[0].constraints);
      return;
    }
    //Hash password
    user.hashPassword();

    try {
      const userServiceObj = await new UserService();
      userServiceObj.createUserService(user);
    } catch (error) {
      res.status(409).send({ message: "Conflict - Email already exited" });
      return;
    }

    res.status(201).send({ message: "User created" });
  };
  static editOneById = async (req: Request, res: Response) => {
    const id = req.params.id;
    let { email, name } = req.body;
    const idOfUpdater = res.locals.jwtPayload.userId;
    const userServiceObj = new UserService();

    //Check validate ID
    const user = await userServiceObj.findUserById(req, res);

    //Check access user edit
    if (idOfUpdater !== parseInt(id)) {
      console.log(idOfUpdater);
      console.log(id);
      return res.status(401).send({
        message: "You cant update the other user",
      });
    }
    //Validate
    user.email = email;
    user.name = name;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    try {
      await userServiceObj.editOneByIdUserService(user);
    } catch (error) {
      res.status(409).send({ message: "Conflict - Email already exited" });
      return;
    }
    res.status(200).send({ message: "User updated" });
  };

  static deleteOneById = async (req: Request, res: Response) => {
    const userServiceObj = new UserService();
    const user = await userServiceObj.findUserById(req, res);
    const userRepository = getRepository(User);

    userRepository.delete(user.id);
    res.status(200).send({
      message: "Deleted",
    });
  };
}

export default UserController;
