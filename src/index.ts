import { NexiosOptions, NexiosResponse } from "./interfaces";
import { handleRequest } from "./requestHandler";
import { NexiosResponseInterceptor, RequestInterceptor } from "./types";

export class Nexios {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: NexiosResponseInterceptor<any>[] = [];
  private defaultConfig: NexiosOptions;
  private baseURL?: string;

  private static globalDefaults: NexiosOptions = {};
  private instanceDefaults: NexiosOptions = {};

  constructor(config: NexiosOptions = {}) {
    this.defaultConfig = config;
    this.baseURL = config.baseURL;
  }

  static setGlobalDefaults(defaults: NexiosOptions) {
    this.globalDefaults = { ...this.globalDefaults, ...defaults };
  }

  static getGlobalDefaults(): NexiosOptions {
    return this.globalDefaults;
  }

  setDefaults(defaults: NexiosOptions) {
    this.instanceDefaults = { ...this.instanceDefaults, ...defaults };
  }

  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: NexiosResponseInterceptor<any>) {
    this.responseInterceptors.push(interceptor);
  }

  private mergeConfig(config: NexiosOptions): NexiosOptions {
    return {
      ...Nexios.getGlobalDefaults(),
      ...this.defaultConfig,
      ...this.instanceDefaults,
      ...config,
    };
  }

  async get<T>(
    url: string,
    options: NexiosOptions = {}
  ): Promise<NexiosResponse<T>> {
    options.method = "GET";
    return this.makeRequest(url, options);
  }

  async post<T>(
    url: string,
    body: any,
    options: NexiosOptions = {}
  ): Promise<NexiosResponse<T>> {
    options.method = "POST";
    options.body = JSON.stringify(body);
    return this.makeRequest(url, options);
  }

  async put<T>(
    url: string,
    body: any,
    options: NexiosOptions = {}
  ): Promise<NexiosResponse<T>> {
    options.method = "PUT";
    options.body = JSON.stringify(body);
    return this.makeRequest(url, options);
  }

  async delete<T>(
    url: string,
    options: NexiosOptions = {}
  ): Promise<NexiosResponse<T>> {
    options.method = "DELETE";
    return this.makeRequest(url, options);
  }

  // Handle all request types
  private async makeRequest<T>(
    url: string,
    options: NexiosOptions
  ): Promise<NexiosResponse<T>> {
    const finalConfig = this.mergeConfig(options);
    return handleRequest<T>(
      this.baseURL,
      url,
      finalConfig,
      this.requestInterceptors,
      this.responseInterceptors
    );
  }
}
