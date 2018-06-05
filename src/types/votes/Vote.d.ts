import { VoteTally } from "./VoteTally";

export interface Vote {
  issue: string;
  result: string;
  voteTally: VoteTally;
}
