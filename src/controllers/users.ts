import { NextFunction, Request, Response } from "express";

export let userController = (request: Request, response: Response, next: NextFunction) => {
  response.send("respond with a resource");
};
