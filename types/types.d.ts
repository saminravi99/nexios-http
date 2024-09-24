import { NexiosOptions, NexiosResponse } from "./interfaces";
export type RequestInterceptor = (config: NexiosOptions) => NexiosOptions | Promise<NexiosOptions>;
export type ResponseInterceptor = (response: Response) => Promise<Response> | Response;
export type NexiosResponseInterceptor<T> = (nexiosResponse: NexiosResponse<T>) => Promise<NexiosResponse<T>> | NexiosResponse<T>;
