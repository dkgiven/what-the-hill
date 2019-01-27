import { CongressMetadata } from "../congress/CongressMetadata";
import { Vote } from "./Vote";

export interface VoteSummary extends CongressMetadata {
  votes: Vote[];
}
