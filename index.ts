interface AjaxFetchConfig extends RequestInit {
  url: string,
  baseURL?: string,
}

interface AjaxFetchError {
  symbol: AjaxFetchSymbol,
  error: any,
}

type AjaxFetchSymbol = string | number;

export class AjaxFetch {
  private static instanceSerial: number = 0;
  public static of(symbol?: AjaxFetchSymbol): AjaxFetch {
    return new AjaxFetch(symbol);
  }

  constructor(symbol?: AjaxFetchSymbol) {
    this.symbol = symbol || `serial-${AjaxFetch.instanceSerial++}`;
  }

  private symbol: AjaxFetchSymbol;

  private init: RequestInit = {
    cache: 'default', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // *omit, same-origin, include
    headers: {
      'content-type': 'application/json',
    },
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // *same-origin, cors, no-cors
    redirect: 'follow', // *follow, manual, error
    referrer: 'client', // *client, no-referrer
  };

  // interceptors
  public interceptors = {
    request: {
      list: [],
      map: {},
      use(fn: (config: AjaxFetchConfig) => AjaxFetchConfig): number {
        const fid = AjaxFetch.interceptorUse(this.list, this.map, fn);
        return fid;
      },
      remove(fid: number): void {
        AjaxFetch.interceptorRemove(this.list, this.map, fid);
      },
    },
    response: {
      list: [],
      map: {},
      use(fn: (res: Response) => Response): number {
        return AjaxFetch.interceptorUse(this.list, this.map, fn);
      },
      remove(fid: number): void {
        AjaxFetch.interceptorRemove(this.list, this.map, fid);
      },
    },
  };

  private static interceptorUse(list, map, fn): number {
    const fid = Math.floor(100000 * Math.random());
    map[fid] = fn;
    list.push(fid);
    return fid;
  }

  private static interceptorRemove(list, map, fid): void {
    const index = list.findIndex(id => id === fid);
    if (index !== -1) {
      list.splice(index, 1);
      Reflect.deleteProperty(map, fid);
    }
  }

  private useBaseURLInterceptor(config: AjaxFetchConfig): AjaxFetchConfig {
    const { url, baseURL } = config;
    if (!url.startsWith('http') && !url.startsWith('//') && baseURL) {
      return { ...config, url: `${baseURL}${url}` };
    }
    return config;
  }

  public interceptedAjax<T>(originConfig: AjaxFetchConfig): Promise<T> {
    const requestInterceptor = this.interceptors.request;
    const requestInterceptorFns = [this.useBaseURLInterceptor, ...requestInterceptor.list.map(fid => requestInterceptor.map[fid])].reverse();
    const responseInterceptor = this.interceptors.response;
    const responseInterceptorFns = responseInterceptor.list.map(fid => responseInterceptor.map[fid]).reverse();
    // use request interceptors
    const { url, ...customConfig } = requestInterceptorFns.reduce((acc, fn) => fn(acc), { ...originConfig });
    // use response interceptors
    return fetch(url, customConfig).then(res => responseInterceptorFns.reduce((acc, fn) => fn(acc), res).text(), this.errorHandler).then(resText => resText ? JSON.parse(resText) : null);
  }

  public ajax<T>(url: string, customConfig: RequestInit = {}): Promise<T> {
    return this.interceptedAjax({
      ...this.init,
      ...customConfig,
      url,
    });
  }

  public get<T>(url: string, customConfig: RequestInit = {}): Promise<T> {
    return this.ajax<T>(url, {
      ...customConfig,
      method: 'GET',
    });
  }

  public post<T>(url: string, body?: BodyInit, customConfig: RequestInit = {}): Promise<T> {
    return this.ajax<T>(url, {
      ...customConfig,
      method: 'POST',
      body,
    });
  }

  public put<T>(url: string, body?: BodyInit, customConfig: RequestInit = {}): Promise<T> {
    return this.ajax<T>(url, {
      ...customConfig,
      method: 'PUT',
      body,
    });
  }

  public delete<T>(url: string, body?: BodyInit, customConfig: RequestInit = {}): Promise<T> {
    return this.ajax<T>(url, {
      ...customConfig,
      method: 'DELETE',
      body,
    });
  }

  private errorHandler(err: any): AjaxFetchError {
    const error: AjaxFetchError = {
      symbol: this.symbol,
      error: err,
    };
    console.error(error);
    return error;
  }
};

let ajaxFetch: AjaxFetch = null;
if (!ajaxFetch) {
  ajaxFetch = AjaxFetch.of();
}
export default ajaxFetch;
