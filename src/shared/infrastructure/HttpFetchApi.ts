import { ConstructorMetadataEmitter } from "../../dependency-injection/ConstructorMetadataEmitter";
import { Http } from "./Http";

@ConstructorMetadataEmitter()
export class HttpFetchApi extends Http {
  async get<T>(url: string, headers?: Record<string, string>): Promise<T> {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
}
