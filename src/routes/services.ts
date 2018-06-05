import { NextFunction, Request, Response, Router } from "express";
import { Middleware } from "express-graphql";
import senateGraphQlRouter from "./senate";

const router: Router = Router();

router.use(
    (req: Request, res: Response, next: NextFunction) => {
        console.log("Service accessed at: ", Date.now());
        next();
    }
);

router.all("/", (req: Request, res: Response, next: NextFunction) => {
  // TODO: Accomplish everything we want to for /services
  res.send("Welcome to the WTH Data service!");
});

// Hook up services to their respective handler/router
router.use("/senate", senateGraphQlRouter as Middleware);

export default router;
