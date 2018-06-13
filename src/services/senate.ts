import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { Element, ElementCompact, Options, xml2js, xml2json } from "xml-js";
import ResponseFactory from "../factory/ResponseFactory";
import { RollCallVote } from "../types/votes/RollCallVote";
import { VoteSummary } from "../types/votes/VoteSummary";
import { prependStrRecursively } from "../utils/StringUtils";

interface SenateServiceType {
  id: string;
  name: string;
  relativeUrlFunc: (congress: number, session: number, voteNum?: number) => string;
  rootXmlKey: string;
  url: string;
}

// TODO: Move into own config
// TODO: modelType doesn't do much good here
const serviceTypes: SenateServiceType[] = [{
  id: "roll-call-lists",
  name: "Roll Call Lists",
  relativeUrlFunc: (congress: number, session: number) => {
    return `vote_menu_${congress}_${session}.xml`;
  },
  rootXmlKey: "vote_summary",
  url: "roll_call_lists"
} as SenateServiceType,
{
  id: "roll-call-votes",
  name: "Roll Call Votes",
  relativeUrlFunc: (congress: number, session: number, voteNum: number) => {
    let voteNumStr = voteNum.toFixed(0);
    // NOTE: Senate.gove url expects padded str with length === 5
    voteNumStr = prependStrRecursively("0", voteNumStr, 5);
    return `vote${congress}${session}/vote_${congress}_${session}_${voteNumStr}.xml`;
  },
  rootXmlKey: "roll_call_vote",
  url: "roll_call_votes"
} as SenateServiceType];

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
    console.debug(
      `SenateDataService initialized with config = [${JSON.stringify(this.requestEngine.defaults, undefined, 4)}]`
    );
  }
  public getRollCallVotes = (
    congress: number = SenateDataService.CONGRESS_MAX,
    session: number = SenateDataService.SESSION_MAX,
    voteNum: number = 1
  ): Promise<RollCallVote> => {
    const rollCallVotes: SenateServiceType = this.getSerivceType("roll-call-votes");
    return this.getServiceResponse(rollCallVotes, congress, session, voteNum);
  };

  public getRollCallLists = (
    congress: number = SenateDataService.CONGRESS_MAX,
    session: number = SenateDataService.SESSION_MAX
  ): Promise<VoteSummary> => {
    const rollCallLists: SenateServiceType = this.getSerivceType("roll-call-lists");
    return this.getServiceResponse(rollCallLists, congress, session);
  }

  public getServiceResponse = (serviceType: SenateServiceType, congress: number , session: number, voteNum?: number): Promise<any> => {
    const relativeUrlWithXmlPath: string = `${serviceType.url}/${serviceType.relativeUrlFunc(congress, session, voteNum)}`;
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
  private getSerivceType = (id: string): SenateServiceType => {
    return serviceTypes.filter((service) => service.id === id)[0];
  }
}
