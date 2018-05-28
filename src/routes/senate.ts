import { AxiosResponse } from "axios";
import { NextFunction, Request, Response, Router } from "express";
import { SenateDataService } from "../services/senate";
const senateRouter: Router = Router();
const senateService: SenateDataService = new SenateDataService();

senateRouter.all("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Thanks for using the senate service");
});

senateRouter.all("/roll-call-votes/:congress/:session", (req: Request, res: Response, next: NextFunction) => {
  const congress: number = req.params.congress as number;
  const session: number = req.params.session as number;
  const rollCallVotesPromise: Promise<string> = senateService.getRollCallVotes(congress, session);
  rollCallVotesPromise.then((responseAsJson: string) => {
    res.send(responseAsJson);
  });
});

export default senateRouter;
