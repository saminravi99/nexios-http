import {
  processRequestInterceptors,
  processResponseInterceptors,
} from "./interceptors";
import { NexiosOptions, NexiosResponse } from "./interfaces";
import { NexiosResponseInterceptor, RequestInterceptor } from "./types";
import { getCookie, getFullURL, serializeParams } from "./utils";

export async function handleRequest<T>(
  baseURL: string | undefined,
  url: string,
  options: NexiosOptions,
  requestInterceptors: RequestInterceptor[],
  responseInterceptors: NexiosResponseInterceptor<T>[]
): Promise<NexiosResponse<T>> {
  // Process request interceptors
  const finalConfig = await processRequestInterceptors(
    options,
    requestInterceptors.filter(
      (interceptor) => typeof interceptor === "function"
    )
  );

  // Handle request timeout and cancelToken using AbortController
  const controller = new AbortController();
  const timeout = finalConfig.timeout || 0;
  if (timeout) {
    setTimeout(() => controller.abort(), timeout);
  }
  finalConfig.signal = controller.signal;

  // Handle cancelToken
  if (finalConfig.cancelToken) {
    finalConfig.cancelToken.promise.then(() => {
      controller.abort();
    });
  }

  // Handle XSRF token (Cross-Site Request Forgery)
  const headers = new Headers(finalConfig.headers);
  if (finalConfig.xsrfCookieName && finalConfig.xsrfHeaderName) {
    const xsrfToken = getCookie(finalConfig.xsrfCookieName);
    if (xsrfToken) {
      headers.set(finalConfig.xsrfHeaderName, xsrfToken);
    }
  }

  // Handle params and custom paramsSerializer
  if (finalConfig.params) {
    const serializedParams = finalConfig.paramsSerializer
      ? finalConfig.paramsSerializer(finalConfig.params)
      : serializeParams(finalConfig.params);
    url += `?${serializedParams}`;
  }

  // Handle authentication (basic auth)
  if (finalConfig.auth) {
    const { username, password } = finalConfig.auth;
    headers.set("Authorization", "Basic " + btoa(`${username}:${password}`));
  }

  // Handle withCredentials (cookies for cross-origin requests)
  if (finalConfig.withCredentials) {
    finalConfig.credentials = "include";
  } else if (finalConfig.credentials === undefined) {
    finalConfig.credentials = "same-origin";
  }

  // Enforce maxContentLength and maxBodyLength
  await checkRequestBodySize(
    finalConfig.body,
    finalConfig.maxContentLength,
    finalConfig.maxBodyLength
  );

  // // Handle upload progress using XMLHttpRequest (fetch does not natively support progress tracking)
  // if (finalConfig.onUploadProgress || finalConfig.onDownloadProgress) {
  //   return handleProgressRequest<T>(
  //     baseURL,
  //     url,
  //     finalConfig,
  //     headers,
  //     responseInterceptors
  //   );
  // }

  // Handle proxy (if provided)
  let proxyUrl: string | undefined;
  if (finalConfig.proxy) {
    const { protocol = "http", host, port, auth } = finalConfig.proxy;
    if (host) {
      const authString = auth
        ? `${encodeURIComponent(auth.username)}:${encodeURIComponent(
            auth.password
          )}@`
        : "";
      proxyUrl = `${protocol}://${authString}${host}${port ? `:${port}` : ""}`;
    }
  }

  // Send the HTTP request using fetch
  const response = await fetch(getFullURL(proxyUrl || baseURL, url), {
    ...finalConfig,
    headers,
  });

  // Handle redirection
  if (finalConfig.maxRedirects) {
    const redirectCount = response.redirected ? 1 : 0;
    if (redirectCount >= finalConfig.maxRedirects) {
      throw new Error(
        `Exceeded maximum redirect limit of ${finalConfig.maxRedirects}`
      );
    }
  }

  // Handle responseType
  let responseData: any;
  switch (finalConfig.responseType) {
    case "blob":
      responseData = await response.blob();
      break;
    case "arraybuffer":
      responseData = await response.arrayBuffer();
      break;
    case "text":
      responseData = await response.text();
      break;
    case "json":
    default:
      responseData = await response.json();
      break;
  }

  // Apply transformResponse (if provided)
  if (
    finalConfig.transformResponse &&
    Array.isArray(finalConfig.transformResponse)
  ) {
    finalConfig.transformResponse.forEach((transformFn) => {
      responseData = transformFn(responseData);
    });
  }

  // Validate response status
  const validateStatus =
    finalConfig.validateStatus ||
    ((status: number) => status >= 200 && status < 300);
  if (!validateStatus(response.status)) {
    throw new Error(`Request failed with status code ${response.status}`);
  }

  // Create the NexiosResponse object
  const nexiosResponse: NexiosResponse<T> = {
    data: responseData,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    config: finalConfig,
    url: response.url,
    request: response,
  };

  // Process response interceptors
  const finalResponse = await processResponseInterceptors(
    nexiosResponse,
    responseInterceptors.filter(
      (interceptor) => typeof interceptor === "function"
    )
  );

  return finalResponse;
}

// Enforce maxContentLength and maxBodyLength
async function checkRequestBodySize(
  body: BodyInit | null | undefined,
  maxContentLength?: number,
  maxBodyLength?: number
) {
  if (body === null) return;

  // Check if body is a string or Blob
  if (typeof body === "string" || body instanceof Blob) {
    const bodySize =
      body instanceof Blob ? body.size : new TextEncoder().encode(body).length;

    if (maxContentLength && bodySize > maxContentLength) {
      throw new Error(
        `Request body exceeds maximum content length of ${maxContentLength}`
      );
    }
    if (maxBodyLength && bodySize > maxBodyLength) {
      throw new Error(
        `Request body exceeds maximum body length of ${maxBodyLength}`
      );
    }
  }

  // Check if body is FormData
  if (body instanceof FormData) {
    const formDataSize = [...body.entries()].reduce((total, [_, value]) => {
      return (
        total +
        (typeof value === "string"
          ? new TextEncoder().encode(value).length
          : value.size)
      );
    }, 0);

    if (maxContentLength && formDataSize > maxContentLength) {
      throw new Error(
        `Request body exceeds maximum content length of ${maxContentLength}`
      );
    }
    if (maxBodyLength && formDataSize > maxBodyLength) {
      throw new Error(
        `Request body exceeds maximum body length of ${maxBodyLength}`
      );
    }
  }

  // Check if body is ArrayBuffer or TypedArray
  if (body instanceof ArrayBuffer || ArrayBuffer.isView(body)) {
    const bufferSize =
      body instanceof ArrayBuffer ? body.byteLength : body.byteLength;

    if (maxContentLength && bufferSize > maxContentLength) {
      throw new Error(
        `Request body exceeds maximum content length of ${maxContentLength}`
      );
    }
    if (maxBodyLength && bufferSize > maxBodyLength) {
      throw new Error(
        `Request body exceeds maximum body length of ${maxBodyLength}`
      );
    }
  }

  // If body is a ReadableStream (fetch streaming or similar), length cannot be determined
  if (body instanceof ReadableStream) {
    console.warn(
      "Cannot determine the length of a ReadableStream body. Enforce size limits manually if needed."
    );
  }
}

// Handle progress events with XMLHttpRequest
// async function handleProgressRequest<T>(
//   baseURL: string | undefined,
//   url: string,
//   finalConfig: NexiosOptions,
//   headers: Headers,
//   responseInterceptors: ResponseInterceptor[]
// ): Promise<NexiosResponse<T>> {
//   return new Promise((resolve, reject) => {
//     const xhr = new XMLHttpRequest();
//     const fullUrl = getFullURL(baseURL, url);

//     xhr.open(finalConfig.method || "GET", fullUrl, true);

//     // Set request headers
//     headers.forEach((value, key) => {
//       xhr.setRequestHeader(key, value);
//     });

//     // Handle upload progress
//     if (finalConfig.onUploadProgress) {
//       xhr.upload.onprogress = finalConfig.onUploadProgress;
//     }

//     // Handle download progress
//     if (finalConfig.onDownloadProgress) {
//       xhr.onprogress = finalConfig.onDownloadProgress;
//     }

//     // Handle response
//     xhr.onload = async () => {
//       // Create a mock response object from XMLHttpRequest
//       const mockResponse = createMockResponseFromXHR(xhr);

//       // Process response interceptors with the mock response object
//       const finalResponse = await processResponseInterceptors(
//         mockResponse,
//         responseInterceptors
//       );

//       // Resolve the final response with transformed data
//       resolve({
//         data: await finalResponse.data.json(), // Always parse as JSON
//         status: finalResponse.status,
//         statusText: finalResponse.statusText,
//         headers: finalResponse.headers,
//         config: finalConfig,
//         url: finalResponse.url,
//         request: xhr, // Reference to original xhr object
//       });
//     };

//     // Handle network error
//     xhr.onerror = () => {
//       reject(new Error("Network error"));
//     };

//     // Ensure the body is compatible with XMLHttpRequest
//     xhr.send(getXHRCompatibleBody(finalConfig.body));
//   });
// }
