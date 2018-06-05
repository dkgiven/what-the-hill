import { CongressMetaData } from "../congress/CongressMetadata";
import { Vote } from "./Vote";

export interface VoteSummary extends CongressMetaData {
  votes: Vote[];
}
