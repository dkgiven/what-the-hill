import { AxiosResponse } from "axios";
import { camelCase } from "lodash";
export default class ResponseFactory {

  public static transformtXml2JsonResponse(originalJson: any, valueKey: string): any {
    // Assumes root is object
    // tslint:disable-next-line:prefer-const
    let returnObj: any = {};
    // Ignore keys starting with underscore
    Object.keys(originalJson).filter((key) => !key.startsWith("_")).forEach((key: string) => {
      const camelCasedKey: string = camelCase(key);
      const value = originalJson[key];
      if (Object.keys(value).indexOf(valueKey) !== -1) {
        returnObj[camelCasedKey] = value.value;
      } else {
        if (value instanceof Array) {
          returnObj[camelCasedKey] = value.map((arrayObj) => this.transformtXml2JsonResponse(arrayObj, valueKey));
        } else if (value instanceof Object) {
          returnObj[camelCasedKey] = this.transformtXml2JsonResponse(value, valueKey);
        }
      }
    });
    return returnObj;
  }
}
