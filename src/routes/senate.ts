import { AxiosResponse } from "axios";
import { NextFunction, Request, Response, Router } from "express";
import graphqlHttp from "express-graphql";
import { buildSchema, GraphQLSchema } from "graphql";
import { SenateDataService } from "../services/senate";
import { VoteSummary } from "../types/votes/VoteSummary";

const senateRouter: Router = Router();

const senateService: SenateDataService = new SenateDataService();

const schema: GraphQLSchema = buildSchema(`
  type VoteTally {
    absent: Int
    nays: Int
    present: Int
    yeas: Int
  }
  type Vote {
    issue: String
    result: String
    voteTally: VoteTally
  }
  type NestedVote {
    vote: [Vote]
  }
  type VoteSummary {
    congress: Int
    congressYear: String
    session: Int
    votes: NestedVote
  }
  type VoteSummaryResponse {
    voteSummary: VoteSummary
  }
  type Query {
    getRollCallLists(congress: Int!, session: Int!): VoteSummaryResponse
  }
`);

const rootValue: any = {
  getRollCallLists: (args: any) => {
    return senateService.getRollCallLists(args.congress, args.session).then((votesSummary: VoteSummary) => {
      // FIXME: This is actually a VoteSummaryResponse (due to nested "voteSummary" key)
      return votesSummary;
    });
  }
};

const senateGraphQLHttp: graphqlHttp.Middleware = graphqlHttp({
  // For debug purposes until front-end is built
  graphiql: true,
  rootValue,
  schema
});

export default senateGraphQLHttp;
