import {
  processRequestInterceptors,
  processResponseInterceptors,
} from "./interceptors";
import { NexiosOptions, NexiosResponse } from "./interfaces";
import { RequestInterceptor, ResponseInterceptor } from "./types";
import { getFullURL, serializeParams } from "./utils";

export async function handleRequest<T>(
  baseURL: string | undefined,
  url: string,
  options: NexiosOptions,
  requestInterceptors: RequestInterceptor[],
  responseInterceptors: ResponseInterceptor[]
): Promise<NexiosResponse<T>> {
  const finalConfig = await processRequestInterceptors(
    options,
    requestInterceptors
  );

  const controller = new AbortController();
  const timeout = finalConfig.timeout || 0;
  if (timeout) {
    setTimeout(() => controller.abort(), timeout);
  }
  finalConfig.signal = controller.signal;

  if (finalConfig.params) {
    url += `?${serializeParams(finalConfig.params)}`;
  }

  const headers = new Headers(finalConfig.headers);
  if (finalConfig.auth) {
    const { username, password } = finalConfig.auth;
    headers.set("Authorization", "Basic " + btoa(`${username}:${password}`));
  }

  const response = await fetch(getFullURL(baseURL, url), {
    ...finalConfig,
    headers,
  });

  const finalResponse = await processResponseInterceptors(
    response,
    responseInterceptors
  );

  const data = await finalResponse.json();
  return {
    data,
    status: finalResponse.status,
    statusText: finalResponse.statusText,
    headers: finalResponse.headers,
    config: finalConfig,
    url: finalResponse.url,
    request: finalResponse,
  };
}
