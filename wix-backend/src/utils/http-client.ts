import https from 'https';
import { IHttpClient } from './types';
import { safeJSONParse } from '.';

type TResolve<T = unknown> = (vaue: T | PromiseLike<T>) => void;
type TReject = (reason: any) => void;

export abstract class HttpClient implements IHttpClient {

  constructor(private readonly apiURL: string) {
    this.baseUrl = apiURL;
  }

  _baseUrl: string;

  set baseUrl(value: string) {
    this._baseUrl = value;
  }

  abstract transformHeaders(headers: Record<string, string>): Record<string, string>;

  buildQueryString(options) {
    return Object.entries(options)
    .filter(([,v]) => typeof v === 'object' ? Object.keys(v).length : v)
    .reduce((acc, [k, v]) => `${acc}${k}=${typeof v === 'object' ? encodeURIComponent(JSON.stringify(v)) : v}&`, '?')
    .slice(0, -1)
  }

  request<T, K = T>(path: string, method: string = 'GET', body?: K) {

    let resolve: TResolve, reject: TReject;

    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });

    const headers = this.transformHeaders({
      'Content-Type': 'application/json'
    });

    const options = {
      method,
      headers
    }

    console.log(`${this.apiURL}${path}`);

    const req = https.request(`${this.apiURL}${path}`, options, async (res) => {
      let data = '';
      for await (const chunk of res) {
        data += chunk;
      }

      if(res.statusCode >= 400) {
        console.error(data);
        return reject(safeJSONParse(data));
      }

      resolve(JSON.parse(data));
    });


    if(body) {
      headers['Content-Length'] = Buffer.byteLength(JSON.stringify(body)).toString();
      req.write(JSON.stringify(body));
    }

    req.end();

    return promise;
  }

  get<T>(path: string) {
    return this.request<T>(path, 'GET');
  }

  post<T, K = T>(path: string, body: K) {
    return this.request<T, K>(path, 'POST', body);
  }

  patch<T, K = T>(path: string, body: K) {
    return this.request<T, K>(path, 'PATCH', body);
  }

  delete<T = unknown>(path) {
    return this.request<T>(path, 'DELETE');
  }

}
