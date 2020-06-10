import { Permision } from "./../entity/Permision";
import { getRepository } from "typeorm";
import { Request, Response } from "express";

export default class PermisionController {
  static newOne = async (req: Request, res: Response) => {
    let { role, resource, method, type } = req.body;
    let permision = new Permision();
    permision.role = role;
    permision.resource = resource;
    permision.method = method;
    permision.type = type;

    try {
      const permisionRepository = getRepository(Permision);
      await permisionRepository.save(permision);
      return res
        .status(201)
        .send({ data: permision, message: "Permision created" });
    } catch (error) {
      res.send(error);
      return;
    }
  };

  static getAll = async (req: Request, res: Response) => {
    const permisionRepository = getRepository(Permision);

    res.status(200).send(
      await permisionRepository.find({
        select: ["role", "resource", "method", "type"],
      })
    );
  };
}
