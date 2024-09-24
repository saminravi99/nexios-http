# 🌟 Nexios: The Ultimate Fetch Library for Next.js 🌟

Welcome to **Nexios**, a cutting-edge fetch library crafted for seamless integration with Next.js applications. With Nexios, you can enhance your data-fetching capabilities using advanced features like customizable interceptors and default configurations. This library is the perfect companion for modern web development, enabling you to build robust, efficient applications with ease.

## 🚀 Features

- **🔧 Customizable Interceptors**: Effortlessly modify requests and responses to meet your needs.
- **⚙️ Configurable Defaults**: Set global and instance-specific defaults for consistent behavior.
- **🔐 Secure Token Management**: Automatically include authentication tokens for secure API access.
- **🔄 Response Transformation**: Adjust and manipulate response data as required.
- **🌍 Tailored for Next.js**: Integrate smoothly with Next.js environments to maximize performance.

## 📦 Installation

Add Nexios to your Next.js project using npm or yarn:

```bash
npm install nexios-http
# or
yarn add nexios-http
```

## 🛠️ Getting Started

### 1. Create a Nexios Configuration File

Create a configuration file to set up your Nexios instance with default settings and interceptors. This file will manage global configurations and interceptors for all requests.

**`nexios.config.ts`**

```typescript
import { Nexios } from "nexios-http";
import { NexiosOptions } from "nexios-http/types/interfaces";
import { cookies } from "next/headers";

// Default configuration for Nexios
const defaultConfig: NexiosOptions = {
  baseURL: "https://jsonplaceholder.typicode.com",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  credentials: "include",
  timeout: 10000,
};

const nexiosInstance = new Nexios(defaultConfig);

// Add request interceptor
nexiosInstance.interceptors.request.use((config) => {
  const accessToken = cookies().get("accessToken")?.value;

  if (accessToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }

  return config;
});

// Add response interceptor
nexiosInstance.interceptors.response.use((response) => {
  // Transform response data if needed
  return response;
});

export default nexiosInstance;
```

### 2. Use Nexios in Your Next.js Pages

Now that you have a configured Nexios instance, you can use it in your Next.js pages to make HTTP requests.

**`page.tsx`**

```typescript
import nexiosInstance from "@/config/nexios.config";

export default async function Home() {
  // Perform a GET request using the configured Nexios instance
  const response = await nexiosInstance.get("/todos/1", {
    cache: "no-store",
  });

  console.log(response.data);

  return <div>Hello</div>;
}
```

### 3. Handle Errors Gracefully

Catch and handle errors effectively to enhance user experience.

**Example Error Handling**

```typescript
import nexiosInstance from "@/config/nexios.config";

export default async function Home() {
  try {
    const response = await nexiosInstance.get("/todos/1", {
      cache: "no-store",
    });
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }

  return <div>Hello</div>;
}
```

## 📚 API Documentation

### Nexios Class

- **Constructor**: `constructor(config: NexiosOptions = {})`
  - **config**: Optional configuration object to initialize the instance.

### Static Methods

- **setGlobalDefaults(defaults: NexiosOptions)**: Set global configuration defaults for all Nexios instances.
- **getGlobalDefaults(): NexiosOptions**: Retrieve global configuration defaults.

### Instance Methods

- **setDefaults(defaults: NexiosOptions)**: Set instance-specific defaults.
- **addRequestInterceptor(interceptor: RequestInterceptor)**: Add a request interceptor.
- **addResponseInterceptor(interceptor: ResponseInterceptor)**: Add a response interceptor.
- **get<T>(url: string, options?: NexiosOptions)**: Perform a GET request.
- **post<T>(url: string, body: any, options?: NexiosOptions)**: Perform a POST request.
- **put<T>(url: string, body: any, options?: NexiosOptions)**: Perform a PUT request.
- **delete<T>(url: string, options?: NexiosOptions)**: Perform a DELETE request.
- **patch<T>(url: string, body: any, options?: NexiosOptions)**: Perform a PATCH request.
- **head<T>(url: string, options?: NexiosOptions)**: Perform a HEAD request.
- **options<T>(url: string, options?: NexiosOptions)**: Perform an OPTIONS request.

## 💡 Advanced Usage

### Customizing Headers

Modify headers for specific requests:

```typescript
nexiosInstance.get("/endpoint", { headers: { "X-Custom-Header": "value" } });
```

### Timeout Handling

Set request-specific timeouts:

```typescript
nexiosInstance.get("/endpoint", { timeout: 5000 });
```

### Handling Caching

Manage caching with the cache option:

```typescript
nexiosInstance.get("/endpoint", { cache: "no-store" });
```

## 📜 License

Nexios is licensed under the MIT License.

## 🙋‍♂️ Support

For support, please open an issue on the [GitHub repository](https://github.com/saminravi99/nexios-http/issues).

---

Thank you for choosing **Nexios**! We hope it simplifies your data-fetching needs and enhances your Next.js development experience. **Happy coding!** 🚀✨
