import { InterceptorManager } from "./interceptorManager";
import { NexiosOptions, NexiosResponse } from "./interfaces";
export declare class Nexios {
    interceptors: {
        request: InterceptorManager<NexiosOptions>;
        response: InterceptorManager<NexiosResponse<any>>;
    };
    private defaultConfig;
    private baseURL?;
    private static globalDefaults;
    private instanceDefaults;
    constructor(config?: NexiosOptions);
    static setGlobalDefaults(defaults: NexiosOptions): void;
    static getGlobalDefaults(): NexiosOptions;
    setDefaults(defaults: NexiosOptions): void;
    private mergeConfig;
    private makeRequest;
    get<T>(url: string, options?: NexiosOptions): Promise<NexiosResponse<T>>;
    post<T>(url: string, body: any, options?: NexiosOptions): Promise<NexiosResponse<T>>;
    put<T>(url: string, body: any, options?: NexiosOptions): Promise<NexiosResponse<T>>;
    delete<T>(url: string, options?: NexiosOptions): Promise<NexiosResponse<T>>;
    create(): Nexios;
}
declare const nexiosInstance: Nexios;
export default nexiosInstance;
