export interface NexiosOptions extends RequestInit {
    url?: string;
    method?: string;
    body?: any;
    baseURL?: string;
    timeout?: number;
    cache?: "force-cache" | "no-store";
    next?: {
        revalidate?: false | 0 | number;
        tags?: string[];
    };
    transformRequest?: Array<(data: any, headers: Headers) => any>;
    transformResponse?: Array<(data: any) => any>;
    headers?: Record<string, string>;
    params?: Record<string, any>;
    paramsSerializer?: (params: Record<string, any>) => string;
    data?: any;
    withCredentials?: boolean;
    responseType?: "arraybuffer" | "document" | "json" | "text" | "stream" | "blob";
    responseEncoding?: string;
    xsrfCookieName?: string;
    xsrfHeaderName?: string;
    onUploadProgress?: (progressEvent: ProgressEvent) => void;
    onDownloadProgress?: (progressEvent: ProgressEvent) => void;
    maxContentLength?: number;
    maxBodyLength?: number;
    validateStatus?: (status: number) => boolean;
    maxRedirects?: number;
    socketPath?: string | null;
    httpAgent?: any;
    httpsAgent?: any;
    proxy?: {
        protocol?: string;
        host?: string;
        port?: number;
        auth?: {
            username: string;
            password: string;
        };
    };
    cancelToken?: any;
    decompress?: boolean;
    auth?: {
        username: string;
        password: string;
    };
}
export interface NexiosResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: Headers;
    config: NexiosOptions;
    url: string;
    request?: any;
}
export interface InterceptorHandler<T> {
    fulfilled: (value: T) => T | Promise<T>;
    rejected?: (error: any) => any;
}
