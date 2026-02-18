import { InvalidUrlError } from "@shared/errors/InvalidUrlError";

export class LongUrlObjValue {
  constructor(
    private host: string,
    private path: string,
    private protocol: string
  ) { }

  static create(longUrl: string) {
    const url = this.transformToUrl(longUrl);
    const host = url.host;
    const path = `${url.pathname}${url.search}`;
    const protocol = url.protocol;

    return new LongUrlObjValue(host, path, protocol);
  }

  static transformToUrl(longUrl: string) {
    try {
      return new URL(longUrl);
    } catch (error) {
      throw new InvalidUrlError()
    }
  }

  getProps() {
    return {
      host: this.host,
      path: this.path,
      protocol: this.protocol,
    };
  }
}
