import { NextFunction, Request, Response } from "express";

export let indexController = (request: Request, response: Response, next: NextFunction) => {
  response.render("index", {
    title: "Express",
  });
};
