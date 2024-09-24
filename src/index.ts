import { InterceptorManager } from "./interceptorManager";
import { NexiosOptions, NexiosResponse } from "./interfaces";
import { handleRequest } from "./requestHandler";
import { NexiosResponseInterceptor, RequestInterceptor } from "./types";

export class Nexios {
  // Interceptor Managers for handling requests and responses
  interceptors = {
    request: new InterceptorManager<NexiosOptions>(),
    response: new InterceptorManager<NexiosResponse>(),
  };

  private defaultConfig: NexiosOptions;
  private baseURL?: string;

  // Static properties for global defaults
  private static globalDefaults: NexiosOptions = {};
  private instanceDefaults: NexiosOptions = {};

  constructor(config: NexiosOptions = {}) {
    this.defaultConfig = config;
    this.baseURL = config.baseURL;
  }

  // Set global defaults
  static setGlobalDefaults(defaults: NexiosOptions) {
    this.globalDefaults = { ...this.globalDefaults, ...defaults };
  }

  // Get global defaults
  static getGlobalDefaults(): NexiosOptions {
    return this.globalDefaults;
  }

  // Set instance-specific defaults
  setDefaults(defaults: NexiosOptions) {
    this.instanceDefaults = { ...this.instanceDefaults, ...defaults };
  }

  // Merge configuration with global, default, and instance-specific defaults
  private mergeConfig(config: NexiosOptions): NexiosOptions {
    return {
      ...Nexios.getGlobalDefaults(),
      ...this.defaultConfig,
      ...this.instanceDefaults,
      ...config,
    };
  }

  // Handle all request types
  private async makeRequest<T>(
    url: string,
    options: NexiosOptions
  ): Promise<NexiosResponse<T>> {
    // Process request interceptors
    const finalConfig = await this.interceptors.request.forEach(
      this.mergeConfig(options)
    );

    // Handle the request using the request handler
    const response = await handleRequest<T>(
      this.baseURL,
      finalConfig.url || url,
      finalConfig,
      this.interceptors.request.getHandlers() as unknown as RequestInterceptor[], // Accessing the request handlers
      this.interceptors.response.getHandlers() as unknown as NexiosResponseInterceptor<T>[] // Accessing the response handlers
    );

    // Process response interceptors
    return this.interceptors.response.forEach(response);
  }

  // HTTP GET method
  async get<T>(
    url: string,
    options: NexiosOptions = {}
  ): Promise<NexiosResponse<T>> {
    options.method = "GET";
    return this.makeRequest(url, options);
  }

  // HTTP POST method
  async post<T>(
    url: string,
    body: any,
    options: NexiosOptions = {}
  ): Promise<NexiosResponse<T>> {
    options.method = "POST";
    options.body = JSON.stringify(body);
    return this.makeRequest(url, options);
  }

  // HTTP PUT method
  async put<T>(
    url: string,
    body: any,
    options: NexiosOptions = {}
  ): Promise<NexiosResponse<T>> {
    options.method = "PUT";
    options.body = JSON.stringify(body);
    return this.makeRequest(url, options);
  }

  // HTTP DELETE method
  async delete<T>(
    url: string,
    options: NexiosOptions = {}
  ): Promise<NexiosResponse<T>> {
    options.method = "DELETE";
    return this.makeRequest(url, options);
  }

  // Create a new instance of Nexios
  create(): Nexios {
    return new Nexios(); // Create a new instance
  }
}

// Create a default instance
const nexiosInstance = new Nexios();
export default nexiosInstance;
