export interface NexiosOptions extends RequestInit {
  timeout?: number; // Timeout in ms
  cache?: "force-cache" | "no-store"; // Cache configuration
  next?: {
    revalidate?: false | 0 | number; // Cache lifetime control
    tags?: string[]; // Custom cache tags for revalidation
  };
}

// Response type definition
export interface NexiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  config: RequestInit;
  url: string;
}

// Request interceptor type
export type RequestInterceptor = (
  config: NexiosOptions
) => Promise<NexiosOptions> | NexiosOptions;
// Response interceptor type
export type ResponseInterceptor = (
  response: Response
) => Promise<Response> | Response;

// Core Nexios class
export class Nexios {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  // Add request interceptors
  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  // Add response interceptors
  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }

  // Process request interceptors
  private async processRequestInterceptors(
    config: NexiosOptions
  ): Promise<NexiosOptions> {
    let finalConfig = config;
    for (const interceptor of this.requestInterceptors) {
      finalConfig = await interceptor(finalConfig);
    }
    return finalConfig;
  }

  // Process response interceptors
  private async processResponseInterceptors(
    response: Response
  ): Promise<Response> {
    let finalResponse = response;
    for (const interceptor of this.responseInterceptors) {
      finalResponse = await interceptor(finalResponse);
    }
    return finalResponse;
  }

  // Handle Fetch Request
  private async handleRequest(
    url: string,
    options: NexiosOptions
  ): Promise<Response> {
    // Apply request interceptors
    const finalConfig = await this.processRequestInterceptors(options);

    // Timeout support using AbortController
    const controller = new AbortController();
    const timeout = finalConfig.timeout || 0;
    if (timeout) {
      setTimeout(() => controller.abort(), timeout);
    }
    finalConfig.signal = controller.signal;

    // Fetch with extended options for Next.js
    const response = await fetch(url, finalConfig);

    // Apply response interceptors
    const finalResponse = await this.processResponseInterceptors(response);
    return finalResponse;
  }

  // GET Request
  async get<T>(
    url: string,
    options: NexiosOptions = {}
  ): Promise<NexiosResponse<T>> {
    options.method = "GET";
    const response = await this.handleRequest(url, options);
    const data = await response.json();
    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config: options,
      url: response.url,
    };
  }

  // POST Request
  async post<T>(
    url: string,
    body: any,
    options: NexiosOptions = {}
  ): Promise<NexiosResponse<T>> {
    options.method = "POST";
    options.body = JSON.stringify(body);
    const response = await this.handleRequest(url, options);
    const data = await response.json();
    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config: options,
      url: response.url,
    };
  }

  // PUT Request
  async put<T>(
    url: string,
    body: any,
    options: NexiosOptions = {}
  ): Promise<NexiosResponse<T>> {
    options.method = "PUT";
    options.body = JSON.stringify(body);
    const response = await this.handleRequest(url, options);
    const data = await response.json();
    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config: options,
      url: response.url,
    };
  }

  // DELETE Request

  async delete<T>(
    url: string,
    options: NexiosOptions = {}
  ): Promise<NexiosResponse<T>> {
    options.method = "DELETE";
    const response = await this.handleRequest(url, options);
    const data = await response.json();
    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config: options,
      url: response.url,
    };
  }

  // PATCH Request

  async patch<T>(
    url: string,
    body: any,
    options: NexiosOptions = {}
  ): Promise<NexiosResponse<T>> {
    options.method = "PATCH";
    options.body = JSON.stringify(body);
    const response = await this.handleRequest(url, options);
    const data = await response.json();
    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config: options,
      url: response.url,
    };
  }

  // HEAD Request

  async head<T>(
    url: string,
    options: NexiosOptions = {}
  ): Promise<NexiosResponse<T>> {
    options.method = "HEAD";
    const response = await this.handleRequest(url, options);
    const data = await response.json();
    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config: options,
      url: response.url,
    };
  }

  // OPTIONS Request

  async options<T>(
    url: string,
    options: NexiosOptions = {}
  ): Promise<NexiosResponse<T>> {
    options.method = "OPTIONS";
    const response = await this.handleRequest(url, options);
    const data = await response.json();
    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config: options,
      url: response.url,
    };
  }
}
