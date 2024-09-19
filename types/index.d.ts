import { NexiosOptions, NexiosResponse } from "./interfaces";
import { RequestInterceptor, ResponseInterceptor } from "./types";
export declare class Nexios {
    private requestInterceptors;
    private responseInterceptors;
    private defaultConfig;
    private baseURL?;
    private static globalDefaults;
    private instanceDefaults;
    constructor(config?: NexiosOptions);
    static setGlobalDefaults(defaults: NexiosOptions): void;
    static getGlobalDefaults(): NexiosOptions;
    setDefaults(defaults: NexiosOptions): void;
    addRequestInterceptor(interceptor: RequestInterceptor): void;
    addResponseInterceptor(interceptor: ResponseInterceptor): void;
    private mergeConfig;
    get<T>(url: string, options?: NexiosOptions): Promise<NexiosResponse<T>>;
    post<T>(url: string, body: any, options?: NexiosOptions): Promise<NexiosResponse<T>>;
    put<T>(url: string, body: any, options?: NexiosOptions): Promise<NexiosResponse<T>>;
    delete<T>(url: string, options?: NexiosOptions): Promise<NexiosResponse<T>>;
    private makeRequest;
}
