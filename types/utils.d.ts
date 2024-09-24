export declare function serializeParams(params?: Record<string, any>): string;
export declare function getFullURL(baseURL: string | undefined, url: string): string;
export declare function getCookie(name: string): string | undefined;
export declare function createMockResponseFromXHR(xhr: XMLHttpRequest): Response;
export declare function getXHRCompatibleBody(body: BodyInit | null | undefined): XMLHttpRequestBodyInit | null;
