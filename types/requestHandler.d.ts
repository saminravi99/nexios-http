import { NexiosOptions, NexiosResponse } from "./interfaces";
import { NexiosResponseInterceptor, RequestInterceptor } from "./types";
export declare function handleRequest<T>(baseURL: string | undefined, url: string, options: NexiosOptions, requestInterceptors: RequestInterceptor[], responseInterceptors: NexiosResponseInterceptor<T>[]): Promise<NexiosResponse<T>>;
