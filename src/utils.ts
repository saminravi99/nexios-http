export function serializeParams(params: Record<string, any> = {}): string {
  return new URLSearchParams(params).toString();
}

export function getFullURL(baseURL: string | undefined, url: string): string {
  if (baseURL && !url.startsWith("http")) {
    return `${baseURL}${url}`;
  }
  return url;
}

export function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

// Create a mock Response-like object for XMLHttpRequest
export function createMockResponseFromXHR(xhr: XMLHttpRequest): Response {
  const headers = new Headers();
  xhr
    .getAllResponseHeaders()
    .split("\r\n")
    .forEach((header) => {
      const [key, value] = header.split(": ");
      if (key && value) headers.set(key, value);
    });

  // Create a custom Response-like object
  const mockResponse = {
    status: xhr.status,
    statusText: xhr.statusText,
    url: xhr.responseURL,
    headers,
    ok: xhr.status >= 200 && xhr.status < 300,
    redirected: false, // XMLHttpRequest does not redirect
    body: xhr.response, // The actual response body
    bodyUsed: false, // Initially, the body has not been used
    type: "default" as ResponseType, // Default response type
    clone: function () {
      // Create a new mock response object
      return createMockResponseFromXHR(xhr);
    },
    json: async () => JSON.parse(xhr.responseText),
    text: async () => xhr.responseText,
    blob: async () => new Blob([xhr.response]),
    arrayBuffer: async () => new TextEncoder().encode(xhr.responseText).buffer,
    formData: async () => {
      const formData = new FormData();
      // Populate FormData if needed (implement according to your use case)
      return formData;
    },
  };

  return mockResponse as unknown as Response; // Cast to Response type
}

export function getXHRCompatibleBody(
  body: BodyInit | null | undefined
): XMLHttpRequestBodyInit | null {
  if (body === null || body === undefined) {
    return null;
  }

  // Handle different types of body
  if (typeof body === "string") {
    return body; // Directly return string
  }

  if (body instanceof FormData) {
    return body; // FormData is already compatible
  }

  if (body instanceof Blob) {
    return body; // Blob is already compatible
  }

  if (body instanceof ArrayBuffer) {
    return body; // ArrayBuffer is already compatible
  }

  // Handle TypedArrays (Uint8Array, etc.)
  if (ArrayBuffer.isView(body)) {
    return body; // Typed arrays are compatible
  }

  // If it's a JSON object, convert it to a JSON string
  if (typeof body === "object") {
    return JSON.stringify(body);
  }

  // For any other types, just return null
  return null;
}
