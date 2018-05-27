import cookieParser from "cookie-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import createError from "http-errors";
import logger from "morgan";
import sassMiddleware from "node-sass-middleware";
import path from "path";

import { indexController } from "./controllers/index";
import { userController } from "./controllers/users";

const wthApp: Application = express();

// Port setup
wthApp.set("port", process.env.PORT || 3000);

// view engine setup
wthApp.set("views", path.join(__dirname, "../views"));
wthApp.set("view engine", "pug");

wthApp.use(logger("dev"));
wthApp.use(express.json());
wthApp.use(express.urlencoded({ extended: false }));
wthApp.use(cookieParser());
wthApp.use(sassMiddleware({
  dest: path.join(__dirname, "public"),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true,
  src: path.join(__dirname, "public"),
}));
wthApp.use(express.static(path.join(__dirname, "public")));

// Assign controllers here (for now)
wthApp.all("/", indexController);
wthApp.all("/users", userController);

// catch 404 and forward to error handler
wthApp.use((req, res, next) => {
  next(createError(404));
});

// error handler
wthApp.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default wthApp;
