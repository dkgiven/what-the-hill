import { VoteTally } from "./VoteTally";

export interface Vote {
  issue: string;
  result: string;
  question: string;
  title: string;
  voteDate: Date;
  voteNumber: number;
  voteTally: VoteTally;
}
