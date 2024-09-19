import { NexiosOptions } from "./interfaces";
export declare function processRequestInterceptors(config: NexiosOptions, interceptors: Array<(config: NexiosOptions) => Promise<NexiosOptions> | NexiosOptions>): Promise<NexiosOptions>;
export declare function processResponseInterceptors(response: Response, interceptors: Array<(response: Response) => Promise<Response> | Response>): Promise<Response>;
