import { NexiosOptions } from "./interfaces";

export async function processRequestInterceptors(
  config: NexiosOptions,
  interceptors: Array<
    (config: NexiosOptions) => Promise<NexiosOptions> | NexiosOptions
  >
): Promise<NexiosOptions> {
  let finalConfig = config;
  for (const interceptor of interceptors) {
    finalConfig = await interceptor(finalConfig);
  }
  return finalConfig;
}

export async function processResponseInterceptors(
  response: Response,
  interceptors: Array<(response: Response) => Promise<Response> | Response>
): Promise<Response> {
  let finalResponse = response;
  for (const interceptor of interceptors) {
    finalResponse = await interceptor(finalResponse);
  }
  return finalResponse;
}
