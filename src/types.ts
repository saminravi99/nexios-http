import { NexiosOptions } from "./interfaces";

// Request interceptor type
export type RequestInterceptor = (
  config: NexiosOptions
) => Promise<NexiosOptions> | NexiosOptions;
// Response interceptor type
export type ResponseInterceptor = (
  response: Response
) => Promise<Response> | Response;
