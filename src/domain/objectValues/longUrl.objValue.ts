export class LongUrlObjValue {
  constructor(
    private host: string,
    private path: string,
    private protocol: string
  ) {}

  static create(longUrl: string) {
    const host = this.getOnlyHost(longUrl);
    const path = this.getOnlyPath(longUrl);
    const protocol = this.getOnlyProtocol(longUrl);

    return new LongUrlObjValue(host, path, protocol);
  }

  static getOnlyHost(longUrl: string) {
    const url = new URL(longUrl);
    return url.host;
  }

  static getOnlyPath(longUrl: string) {
    const url = new URL(longUrl);

    return `${url.pathname}${url.search}`;
  }

  static getOnlyProtocol(longUrl: string) {
    const url = new URL(longUrl);
    return url.protocol;
  }

  getProps() {
    return {
      host: this.host,
      path: this.path,
      protocol: this.protocol,
    };
  }
}
