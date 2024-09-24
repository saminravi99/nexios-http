import { NexiosOptions, NexiosResponse } from "./interfaces";
import { NexiosResponseInterceptor } from "./types";

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

// export async function processResponseInterceptors(
//   response: Response,
//   interceptors: Array<(response: Response) => Promise<Response> | Response>
// ): Promise<Response> {
//   let finalResponse = response;
//   for (const interceptor of interceptors) {
//     finalResponse = await interceptor(finalResponse);
//   }
//   return finalResponse;
// }

export async function processResponseInterceptors<T>(
  response: NexiosResponse<T>,
  interceptors: NexiosResponseInterceptor<T>[]
): Promise<NexiosResponse<T>> {
  let interceptedResponse = response;

  // Apply each interceptor in the array
  for (const interceptor of interceptors) {
    interceptedResponse = await interceptor(interceptedResponse);
  }

  return interceptedResponse;
}
