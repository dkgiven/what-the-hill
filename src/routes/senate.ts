import graphqlHttp from "express-graphql";
import { buildSchema, GraphQLSchema, Source } from "graphql";
import { SenateDataService } from "../services/senate";
import { VoteSummary } from "../types/votes/VoteSummary";

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
    question: String
    result: String
    title: String
    voteDate: String
    voteNumber: Int
    voteTally: VoteTally
  }
  type NestedVote {
    vote: [Vote]
  }
  type VoteSummary {
    congress: Int
    congressYear: Int
    session: Int
    votes: NestedVote
  }
  type Query {
    getRollCallLists(congress: Int!, session: Int!): VoteSummary
  }
`);

const rootValue: any = {
  getRollCallLists: (args: any) => {
    return senateService.getRollCallLists(args.congress, args.session).then((votesSummary: VoteSummary) => {
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
