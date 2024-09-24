import { InterceptorHandler } from "./interfaces";
export declare class InterceptorManager<T> {
    handlers: Array<InterceptorHandler<T>>;
    use(fulfilled: (value: T) => T | Promise<T>, rejected?: (error: any) => any): number;
    forEach(config: T): Promise<T>;
    getHandlers(): Array<InterceptorHandler<T>>;
}
