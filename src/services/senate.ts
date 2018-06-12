import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { Element, ElementCompact, Options, xml2js, xml2json } from "xml-js";
import ResponseFactory from "../factory/ResponseFactory";
import { RollCallVote } from "../types/votes/RollCallVote";
import { VoteSummary } from "../types/votes/VoteSummary";

interface SenateServiceType<T> {
  id: string;
  modelType: T;
  name: string;
  rootXmlKey: string;
  url: string;
}

// TODO: Move into own config
// TODO: modelType doesn't do much good here
const serviceTypes: Array<SenateServiceType<any>> = [{
  id: "roll-call-lists",
  modelType: {} as VoteSummary,
  name: "Roll Call Lists",
  rootXmlKey: "vote_summary",
  url: "roll_call_lists"
} as SenateServiceType<VoteSummary>,
{
  id: "roll-call-lists",
  modelType: {} as RollCallVote,
  name: "Roll Call Votes",
  rootXmlKey: "roll_call_vote",
  url: "roll_call_votes"
} as SenateServiceType<RollCallVote>];

export class SenateDataService {
  // All inclusive values
  private static readonly BASE_SERVICE_URL: string = "https://www.senate.gov/legislative/LIS/";
  private static readonly CONGRESS_MAX: number = 115;
  private static readonly CONGRESS_MIN: number = 101;
  private static readonly SESSION_MAX: number = 2;
  private static readonly SESSION_MIN: number = 1;
  private static readonly VALUE_KEY: string = "value";
  private static readonly DEFAULT_XMLJSON_CONFIG: Options.XML2JSON = {
    cdataKey: SenateDataService.VALUE_KEY,
    commentKey: SenateDataService.VALUE_KEY,
    // TODO: flip this to false and transform properly to VoteSummary
    compact: true,
    nativeType: true,
    textKey: SenateDataService.VALUE_KEY
  } as Options.XML2JSON;
  private requestEngine: AxiosInstance = axios.create({
    baseURL: SenateDataService.BASE_SERVICE_URL,
    method: "post",
    responseType: "document"
  });

  constructor() {
    console.log(
      `SenateDataService initialized with config = [${this.requestEngine.toString()}]`
    );
  }
  public getRollCallVotes = (
    congress: number = SenateDataService.CONGRESS_MAX,
    session: number = SenateDataService.SESSION_MAX
  ): Promise<VoteSummary> => {
    const rollCallVotes: SenateServiceType<RollCallVote> = serviceTypes.filter((service) => service.id === "roll-call-votes")[0];
    return this.getServiceResponse(rollCallVotes, congress, session);
  };

  public getRollCallLists = (
    congress: number = SenateDataService.CONGRESS_MAX,
    session: number = SenateDataService.SESSION_MAX
  ): Promise<VoteSummary> => {
    const rollCallLists: SenateServiceType<VoteSummary> = serviceTypes.filter((service) => service.id === "roll-call-lists")[0];
    return this.getServiceResponse(rollCallLists, congress, session);
  }

  public getServiceResponse = (serviceType: SenateServiceType<any>, congress: number , session: number): Promise<any> => {
    const relativeUrlWithXmlPath: string = `${serviceType.url}/${SenateDataService.constructXmlPath(congress, session)}`;
    return this.requestEngine
      .request({
        url: relativeUrlWithXmlPath
      })
      .then((response: AxiosResponse) => {
        let responseObj: any;
        try {
          if (response.status === 200) {
            const responseAsJson: string = xml2json(
              response.data,
              SenateDataService.DEFAULT_XMLJSON_CONFIG
            );
            const processedResponse = JSON.parse(responseAsJson);
            responseObj = ResponseFactory.transformXml2JsonResponse(
              processedResponse[serviceType.rootXmlKey],
              SenateDataService.VALUE_KEY
            ) as any;
          } else {
            console.error(response.data);
          }
        } catch (error) {
          console.error(error);
        }
        return responseObj;
      });
  };

  private static constructXmlPath = (
    congress: number = SenateDataService.CONGRESS_MAX,
    session: number = SenateDataService.SESSION_MAX
  ): string => {
    return `vote_menu_${congress}_${session}.xml`;
  };
}
