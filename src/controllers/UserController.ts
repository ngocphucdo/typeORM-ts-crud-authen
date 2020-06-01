import { validate } from "class-validator";
import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { User } from "../entity/User";

class UserController {
  static getAll = async (req: Request, res: Response) => {
    const userRepository = getRepository(User);
    const users = await userRepository.find({
      select: ["id", "email", "role"],
    });
    res.send(users);
  };

  static getOneById = async (req: Request, res: Response) => {
    const id: string = req.params.id;

    const userRepository = getRepository(User);
    try {
      const user = await userRepository.findOneOrFail(id, {
        select: ["id", "email", "role"],
      });
      res.status(200).send(user);
    } catch (error) {
      res.status(404).send({ message: "User not found" });
    }
  };

  static newUser = async (req: Request, res: Response) => {
    let { email, name, password, role } = req.body;
    let user = new User();
    user.email = email;
    user.name = name;
    user.password = password;
    user.role = role;

    //Validate
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors[0].constraints);
      return;
    }

    //Hash password
    user.hashPassword();
    const userRepository = getRepository(User);
    try {
      await userRepository.save(user);
    } catch (error) {
      res.status(409).send({ message: "Conflict - Email already exited" });
      return;
    }

    res.status(201).send({ message: "User created" });
  };
  static editUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    const { email, role } = req.body;

    const userRepository = getRepository(User);
    let user;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    //Validate
    user.email = email;
    user.role = role;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    try {
      await userRepository.save(user);
    } catch (error) {
      res.status(409).send({ message: "Conflict - Email already exited" });
      return;
    }
    res.send(204).send({ message: "User updated" });
  };

  static deleteUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    userRepository.delete(id);
    res.status(204).send({
      message: "Deleted",
    });
  };
}

export default UserController;
