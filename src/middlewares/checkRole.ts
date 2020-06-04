import { Request, Response, NextFunction } from "express";

export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.jwtPayload;
    if (roles.indexOf(user.role) > -1) next();
    else
      res.status(401).send({
        message: "Access denied",
      });
  };
};
