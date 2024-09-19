import { NexiosOptions, NexiosResponse } from "./interfaces";
import { RequestInterceptor, ResponseInterceptor } from "./types";
export declare function handleRequest<T>(baseURL: string | undefined, url: string, options: NexiosOptions, requestInterceptors: RequestInterceptor[], responseInterceptors: ResponseInterceptor[]): Promise<NexiosResponse<T>>;
