import { NexiosOptions, NexiosResponse } from "./interfaces";
import { RequestInterceptor, ResponseInterceptor } from "./types";
export declare class Nexios {
    private requestInterceptors;
    private responseInterceptors;
    private defaultConfig;
    private baseURL?;
    constructor(config?: NexiosOptions);
    private static globalDefaults;
    private instanceDefaults;
    static setGlobalDefaults(defaults: NexiosOptions): void;
    static getGlobalDefaults(): NexiosOptions;
    setDefaults(defaults: NexiosOptions): void;
    private mergeConfig;
    addRequestInterceptor(interceptor: RequestInterceptor): void;
    addResponseInterceptor(interceptor: ResponseInterceptor): void;
    private getFullURL;
    private serializeParams;
    private handleRequest;
    private makeRequest;
    get<T>(url: string, options?: NexiosOptions): Promise<NexiosResponse<T>>;
    post<T>(url: string, body: any, options?: NexiosOptions): Promise<NexiosResponse<T>>;
    put<T>(url: string, body: any, options?: NexiosOptions): Promise<NexiosResponse<T>>;
    delete<T>(url: string, options?: NexiosOptions): Promise<NexiosResponse<T>>;
    patch<T>(url: string, body: any, options?: NexiosOptions): Promise<NexiosResponse<T>>;
    head<T>(url: string, options?: NexiosOptions): Promise<NexiosResponse<T>>;
    options<T>(url: string, options?: NexiosOptions): Promise<NexiosResponse<T>>;
}
