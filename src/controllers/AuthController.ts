import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { User } from "../entity/User";
import { Permision } from "./../entity/Permision";
import config from "../config/config";

class AuthController {
  static login = async (req: Request, res: Response) => {
    // If email and password aren't set
    let { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send({ message: "Input correct email and password !" });
    }

    // Get user from db
    const userRespository = getRepository(User);
    let user: User;
    try {
      user = await userRespository.findOneOrFail({ where: { email } });
    } catch (err) {
      res.status(401).send({ message: "Email not found !" });
    }

    //If encrypted password won't match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).send({ message: "Password incorrect !" });
      return;
    }

    //Create Token and send to response
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    let role;

    //Check role and log Permision of User Login
    const permisionRepository = getRepository(Permision);

    const permisionOfUser = await permisionRepository.find(role);
    console.log(permisionOfUser.filter((p) => p.role === user.role));

    res.send({
      message: "Logged",
      token,
    });
  };

  static changePassword = async (req: Request, res: Response) => {
    //Get id from JWT
    const id = res.locals.jwtPayload.userId;

    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res
        .status(400)
        .send({ message: "Input old password and new password !" });
    }

    const userRespository = getRepository(User);
    let user: User;
    try {
      user = await userRespository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send("Can't find user !");
    }

    //Check if old password matchs
    if (user.checkIfUnencryptedPasswordIsValid(newPassword)) {
      res.status(401).send({
        message: "The new password cannot be set to the same password !",
      });
      return;
    }

    //Validate password
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors[0].constraints);
      return;
    }

    //Hash new password and save
    user.hashPassword();
    userRespository.save(user);

    res.status(200).send({ message: "Updated" });
  };
}

export default AuthController;
