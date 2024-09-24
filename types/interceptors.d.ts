import { NexiosOptions, NexiosResponse } from "./interfaces";
import { NexiosResponseInterceptor } from "./types";
export declare function processRequestInterceptors(config: NexiosOptions, interceptors: Array<(config: NexiosOptions) => Promise<NexiosOptions> | NexiosOptions>): Promise<NexiosOptions>;
export declare function processResponseInterceptors<T>(response: NexiosResponse<T>, interceptors: NexiosResponseInterceptor<T>[]): Promise<NexiosResponse<T>>;
