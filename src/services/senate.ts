import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { xml2json } from "xml-js";

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
    responseType: "json"
  });

  constructor() {
    console.log(`SenateDataService initialized with config = [${this.requestEngine}]`);
  }
  public getRollCallVotes = (
    congress: number = SenateDataService.CONGRESS_MAX,
    session: number = SenateDataService.SESSION_MAX
  ): Promise<string> => {
    const rollCallVoteXmlUrl: string = `roll_call_lists/${SenateDataService.constructXmlPath(congress, session)}`;
    return this.requestEngine.request({
      url: rollCallVoteXmlUrl
    }).then((response: AxiosResponse) => {
      let responseJson: string = "";
      try {
          if (response.status === 200) {
            responseJson = xml2json(response.data);
            console.log(responseJson);
          } else {
            console.error(response.data);
          }
        } catch (error) {
          console.error(error);
        }
      return responseJson;
      })
      ;
    }

  private static constructXmlPath = (
    congress: number = SenateDataService.CONGRESS_MAX,
    session: number = SenateDataService.SESSION_MAX
  ): string => {
    return `vote_menu_${congress}_${session}.xml`;
  };
}
