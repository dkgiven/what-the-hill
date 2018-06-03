export interface VoteTally {
  yeas: number;
  nays: number;
}

export interface Vote {
  issue: string;
  question: string;
  result: string;
  voteDate: Date;
  voteNumber: number;
  voteTally: VoteTally;
}

export interface VoteSummary {
  congress: number;
  congressYear: Date;
  session: number;
  votes: Vote[];
}
