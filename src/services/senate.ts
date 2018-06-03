import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { Element, ElementCompact, Options, xml2js, xml2json } from "xml-js";
import ResponseFactory from "../factory/ResponseFactory";
import { VoteSummary } from "../types/votes/VoteSummary";

export class SenateDataService {
  // All inclusive values
  private static readonly BASE_SERVICE_URL: string = "https://www.senate.gov/legislative/LIS/";
  private static readonly CONGRESS_MAX: number = 115;
  private static readonly CONGRESS_MIN: number = 101;
  private static readonly SESSION_MAX: number = 2;
  private static readonly SESSION_MIN: number = 1;

  private requestEngine: AxiosInstance = axios.create({
    baseURL: SenateDataService.BASE_SERVICE_URL,
    method: "post",
    responseType: "document"
  });

  constructor() {
    console.log(`SenateDataService initialized with config = [${this.requestEngine}]`);
  }
  public getRollCallVotes = (
    congress: number = SenateDataService.CONGRESS_MAX,
    session: number = SenateDataService.SESSION_MAX
  ): Promise<VoteSummary> => {
    const rollCallVoteXmlUrl: string = `roll_call_lists/${SenateDataService.constructXmlPath(congress, session)}`;
    return this.requestEngine.request({
      url: rollCallVoteXmlUrl
    }).then((response: AxiosResponse) => {
      let voteSummary: VoteSummary;
      try {
          if (response.status === 200) {
            const responseAsJson: string = xml2json(response.data, {
              cdataKey: "value",
              commentKey: "value",
              // TODO: flip this to false and transform properly to VoteSummary
              compact: true,
              nativeType: true,
              textKey: "value"
            } as Options.XML2JSON);
            const processedResponse = JSON.parse(responseAsJson);
            voteSummary = ResponseFactory.transformtXml2JsonResponse(processedResponse, "value") as VoteSummary;
          } else {
            console.error(response.data);
          }
        } catch (error) {
          console.error(error);
        }
      return voteSummary;
      });
    }

  private static constructXmlPath = (
    congress: number = SenateDataService.CONGRESS_MAX,
    session: number = SenateDataService.SESSION_MAX
  ): string => {
    return `vote_menu_${congress}_${session}.xml`;
  };
}
