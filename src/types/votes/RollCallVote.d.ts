import { CongressMetaData } from "../congress/CongressMetadata";
import { VoteMetadata } from "./VoteMetadata";
import { VoteTally } from "./VoteTally";

export interface RollCallVote extends CongressMetaData, VoteMetadata {
  count: VoteTally;
  majorityRequirement: string;
  modifyDate: Date;
  voteDocumentText: string;
  voteQuestionText: string;
  voteResult: string;
  voteResultTest: string;
  voteTitle: string;
}
