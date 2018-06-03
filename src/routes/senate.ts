import { AxiosResponse } from "axios";
import { NextFunction, Request, Response, Router } from "express";
import { SenateDataService } from "../services/senate";
import { VoteSummary } from "../types/votes/VoteSummary";
const senateRouter: Router = Router();
const senateService: SenateDataService = new SenateDataService();

senateRouter.all("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Thanks for using the senate service");
});

senateRouter.all("/roll-call-votes/:congress/:session", (req: Request, res: Response, next: NextFunction) => {
  const congress: number = req.params.congress as number;
  const session: number = req.params.session as number;
  const rollCallVotesPromise: Promise<VoteSummary> = senateService.getRollCallVotes(congress, session);
  rollCallVotesPromise.then((votesSummary: VoteSummary) => {
    // Return as JSON
    res.json(votesSummary);
  });
});

export default senateRouter;
