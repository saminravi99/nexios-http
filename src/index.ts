import {
  processRequestInterceptors,
  processResponseInterceptors,
} from "./interceptors";
import { NexiosOptions, NexiosResponse } from "./interfaces";
import { RequestInterceptor, ResponseInterceptor } from "./types";

// Core Nexios class
export class Nexios {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private defaultConfig: NexiosOptions;
  private baseURL?: string;

  constructor(config: NexiosOptions = {}) {
    this.defaultConfig = config;
    this.baseURL = config.baseURL;
  }

  private static globalDefaults: NexiosOptions = {};
  private instanceDefaults: NexiosOptions = {};

  static setGlobalDefaults(defaults: NexiosOptions) {
    this.globalDefaults = { ...this.globalDefaults, ...defaults };
  }

  static getGlobalDefaults(): NexiosOptions {
    return this.globalDefaults;
  }

  // Modify instance defaults after creation
  setDefaults(defaults: NexiosOptions) {
    this.instanceDefaults = { ...this.instanceDefaults, ...defaults };
  }

  // Combine defaults with request-specific options
  private mergeConfig(config: NexiosOptions): NexiosOptions {
    return {
      ...Nexios.getGlobalDefaults(),
      ...this.instanceDefaults,
      ...config,
    };
  }

  // Add request interceptors
  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  // Add response interceptors
  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }

  // Combine baseURL with request URL
  private getFullURL(url: string): string {
    if (this.baseURL && !url.startsWith("http")) {
      return `${this.baseURL}${url}`;
    }
    return url;
  }

  // Serialize parameters
  private serializeParams(params: Record<string, any> = {}): string {
    return new URLSearchParams(params).toString();
  }

  // Handle Fetch Request
  private async handleRequest(
    url: string,
    options: NexiosOptions
  ): Promise<Response> {
    // Merge the global, instance, and request-specific config
    const finalConfig = await processRequestInterceptors(
      this.mergeConfig(options),
      this.requestInterceptors
    );

    // Timeout support using AbortController
    const controller = new AbortController();
    const timeout = finalConfig.timeout || 0;
    if (timeout) {
      setTimeout(() => controller.abort(), timeout);
    }
    finalConfig.signal = controller.signal;

    // Handle params
    if (finalConfig.params) {
      url += `?${this.serializeParams(finalConfig.params)}`;
    }

    // Apply headers
    const headers = new Headers(finalConfig.headers);
    if (finalConfig.auth) {
      const { username, password } = finalConfig.auth;
      headers.set("Authorization", "Basic " + btoa(`${username}:${password}`));
    }

    // Fetch with extended options for Next.js
    const response = await fetch(this.getFullURL(url), {
      ...finalConfig,
      headers,
    });

    // Apply response interceptors
    const finalResponse = await processResponseInterceptors(
      response,
      this.responseInterceptors
    );
    return finalResponse;
  }

  // Generic request handling
  private async makeRequest<T>(
    url: string,
    options: NexiosOptions
  ): Promise<NexiosResponse<T>> {
    try {
      const response = await this.handleRequest(url, options);
      const data = await response.json();
      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        config: options,
        url: response.url,
        request: response, // Storing the response object as 'request' for similarity
      };
    } catch (error: any) {
      throw {
        response: error.response || {},
        message: error.message,
      };
    }
  }

  // GET Request
  async get<T>(
    url: string,
    options: NexiosOptions = {}
  ): Promise<NexiosResponse<T>> {
    options.method = "GET";
    return this.makeRequest(url, options);
  }

  // POST Request
  async post<T>(
    url: string,
    body: any,
    options: NexiosOptions = {}
  ): Promise<NexiosResponse<T>> {
    options.method = "POST";
    options.body = JSON.stringify(body);
    return this.makeRequest(url, options);
  }

  // PUT Request
  async put<T>(
    url: string,
    body: any,
    options: NexiosOptions = {}
  ): Promise<NexiosResponse<T>> {
    options.method = "PUT";
    options.body = JSON.stringify(body);
    return this.makeRequest(url, options);
  }

  // DELETE Request
  async delete<T>(
    url: string,
    options: NexiosOptions = {}
  ): Promise<NexiosResponse<T>> {
    options.method = "DELETE";
    return this.makeRequest(url, options);
  }

  // PATCH Request
  async patch<T>(
    url: string,
    body: any,
    options: NexiosOptions = {}
  ): Promise<NexiosResponse<T>> {
    options.method = "PATCH";
    options.body = JSON.stringify(body);
    return this.makeRequest(url, options);
  }

  // HEAD Request
  async head<T>(
    url: string,
    options: NexiosOptions = {}
  ): Promise<NexiosResponse<T>> {
    options.method = "HEAD";
    return this.makeRequest(url, options);
  }

  // OPTIONS Request
  async options<T>(
    url: string,
    options: NexiosOptions = {}
  ): Promise<NexiosResponse<T>> {
    options.method = "OPTIONS";
    return this.makeRequest(url, options);
  }
}
