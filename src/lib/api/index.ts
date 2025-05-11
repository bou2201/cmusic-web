import { getCookie } from '../cookie';

type RequestInterceptor = (config: RequestInit) => RequestInit | Promise<RequestInit>;
type ResponseInterceptor<T = any> = (response: Response) => T | Promise<T>;

class CustomFetch {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  constructor(private baseURL: string = '') {}

  // Add request interceptor
  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
    return this; // for chaining
  }

  // Add response interceptor
  addResponseInterceptor<T>(interceptor: ResponseInterceptor<T>) {
    this.responseInterceptors.push(interceptor as ResponseInterceptor);
    return this; // for chaining
  }

  // Process request interceptors
  private async processRequestInterceptors(config: RequestInit): Promise<RequestInit> {
    let currentConfig = config;
    for (const interceptor of this.requestInterceptors) {
      currentConfig = await interceptor(currentConfig);
    }
    return currentConfig;
  }

  // Process response interceptors
  private async processResponseInterceptors(response: Response): Promise<any> {
    let currentResponse = response;
    for (const interceptor of this.responseInterceptors) {
      currentResponse = await interceptor(currentResponse);
    }
    return currentResponse;
  }

  // Main fetch method
  async fetch<T>(url: string, config: RequestInit = {}): Promise<T> {
    try {
      // Process request interceptors
      const modifiedConfig = await this.processRequestInterceptors(config);

      // Make the actual fetch call
      const fullUrl = this.baseURL + url;
      const response = await fetch(fullUrl, modifiedConfig);

      // Process response interceptors
      const data = await this.processResponseInterceptors(response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }

  // Convenience methods
  get<T>(url: string, config?: RequestInit): Promise<T> {
    return this.fetch<T>(url, { ...config, method: 'GET' });
  }

  post<T>(url: string, body: any, config?: RequestInit): Promise<T> {
    return this.fetch<T>(url, {
      ...config,
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
    });
  }

  put<T>(url: string, body: any, config?: RequestInit): Promise<T> {
    return this.fetch<T>(url, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
    });
  }

  delete<T>(url: string, config?: RequestInit): Promise<T> {
    return this.fetch<T>(url, { ...config, method: 'DELETE' });
  }
}

const api = new CustomFetch(process.env.NEXT_PUBLIC_API_URL);

// Add common interceptors
api
  .addRequestInterceptor((config) => {
    const token = getCookie('token');
    if (token) {
      return {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        },
      };
    }
    return config;
  })
  .addResponseInterceptor(async (response) => {
    // Parse JSON if content-type is json
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return await response.json();
    }
    return response;
  });

export default api;
