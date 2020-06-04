import { User } from "./../entity/User";
import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import * as jwt from "jsonwebtoken";
import config from "../config/config";

export const checkJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ message: "Access Denied" });
  let jwtPayload;

  try {
    jwtPayload = jwt.verify(token, config.jwtSecret);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    res.status(401).send({ message: error });
    return;
  }

  // Check id from Token match with id in DB
  const id = res.locals.jwtPayload.userId;
  let user: User;
  const userRepository = getRepository(User);
  try {
    user = await userRepository.findOneOrFail(id);
  } catch (id) {
    res.status(401).send();
  }

  //Refresh token every request
  const { userId, email, role } = jwtPayload;
  const newToken = jwt.sign({ userId, email, role }, config.jwtSecret, {
    expiresIn: "1h",
  });
  res.setHeader("auth-token", newToken);

  next();
};
