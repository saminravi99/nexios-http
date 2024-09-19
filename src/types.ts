import { NexiosOptions } from "./interfaces";

export type RequestInterceptor = (
  config: NexiosOptions
) => Promise<NexiosOptions> | NexiosOptions;

export type ResponseInterceptor = (
  response: Response
) => Promise<Response> | Response;
