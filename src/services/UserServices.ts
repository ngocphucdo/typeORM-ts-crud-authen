import { User } from "./../entity/User";
import { getRepository } from "typeorm";
import { Request, Response } from "express";

export default class UserService {
  private resource;
  constructor(user = User) {
    this.resource = getRepository(user);
  }
  public createUserService = async (data: Partial<User>) => {
    return this.resource.save(data);
  };

  public getAllUserService = async () => {
    return this.resource.find({
      select: ["id", "email", "name", "role"],
    });
  };

  public getOneByIdUserService = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    return this.resource.findOneOrFail(id, {
      select: ["id", "email", "name", "role"],
    });
  };

  public editOneByIdUserService = async (user: User) => {
    await this.resource.save(user);
  };

  public findUserById = async (req: Request, res: Response) => {
    const id = req.params.id;
    let user;
    try {
      user = await this.resource.findOneOrFail(id);
    } catch (error) {
      res.status(404).send({ message: "User not found" });
    }
    return user;
  };
}
