import graphqlHttp from "express-graphql";
import { buildSchema, GraphQLSchema, Source } from "graphql";
import { SenateDataService } from "../services/senate";
import { RollCallVote } from "../types/votes/RollCallVote";
import { VoteSummary } from "../types/votes/VoteSummary";

const senateService: SenateDataService = new SenateDataService();
const schema: GraphQLSchema = buildSchema(`
  interface CongressMeta {
    congress: Int
    session: Int
  }
  interface VoteMeta {
    voteDate: String
    voteNumber: Int
  }
  type Amendment {
    amendmentNumber: Int
    amendmentToAmendmentNumber: Int
    amendmentToAmendmentToAmendmentNumber: Int
    amendmentToDocumentNumber: Int
    amendmentToDocumentShortTitle: String
    amendmentPurpose: String
  }
  type Document {
    documentCongress: Int
    documentName: String
    documentNumber: Int
    documentShortTitle: String
    documentTitle: String
    documentType: String
  }
  type Member {
    firstName: String
    lastName: String
    lisMemberId: String
    memberFull: String
    party: String
    state: String
    voteCast: String
  }
  type VoteTally {
    absent: Int
    nays: Int
    present: Int
    yeas: Int
  }
  type TieBreaker {
    byWhom: String
    tieBreakerVote: String
  }
  type Vote implements VoteMeta {
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
  type NestedMember {
    member: [Member]
  }
  type VoteSummary implements CongressMeta {
    congress: Int
    congressYear: Int
    session: Int
    votes: NestedVote
  }
  type RollCallVote implements VoteMeta {
    count: VoteTally
    document: Document
    majorityRequirement: String
    members: NestedMember
    modifyDate: String
    question: String
    tieBreaker: TieBreaker
    voteDate: String
    voteDocumentText: String
    voteNumber: Int
    voteQuestionText: String
    voteResultText: String
    voteTitle: String
  }
  type Query {
    getRollCallLists(congress: Int!, session: Int!): VoteSummary
    getRollCallVotes(congress: Int!, session: Int!, voteNum: Int!): RollCallVote
  }
`);

const rootValue: any = {
  getRollCallLists: (args: any) => {
    return senateService.getRollCallLists(args.congress, args.session).then((votesSummary: VoteSummary) => {
      return votesSummary;
    });
  },
  getRollCallVotes: (args: any) => {
    return senateService.getRollCallVotes(args.congress, args.session, args.voteNum).then((rollCallVote: RollCallVote) => {
      return rollCallVote;
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
