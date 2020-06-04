import { User } from "./../entity/User";
import { getRepository } from "typeorm";

export class UserService {
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
}
