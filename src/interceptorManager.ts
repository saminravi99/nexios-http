import { InterceptorHandler } from "./interfaces";

export class InterceptorManager<T> {
  public handlers: Array<InterceptorHandler<T>> = [];

  // Use method to add interceptor
  use(fulfilled: (value: T) => T | Promise<T>, rejected?: (error: any) => any) {
    if (typeof fulfilled !== "function") {
      throw new Error("fulfilled interceptor must be a function");
    }
    this.handlers.push({ fulfilled, rejected });
    return this.handlers.length - 1;
  }

  forEach(config: T): Promise<T> {
    let promise = Promise.resolve(config);

    this.handlers.forEach(({ fulfilled, rejected }) => {
      if (typeof fulfilled === "function") {
        promise = promise.then(fulfilled, rejected);
      } else {
        console.error("Interceptor 'fulfilled' is not a function:", fulfilled);
      }
    });

    return promise;
  }

  // Get the handlers (for internal use if needed)
  getHandlers(): Array<InterceptorHandler<T>> {
    return this.handlers;
  }
}
