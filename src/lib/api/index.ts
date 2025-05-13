import { authService } from './../../modules/auth/service/index';
import { getCookie, setCookie } from '../cookie';
import { ApiReturn } from '~types/common';

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

  // Helper method to rebuild the original request
  private buildOriginalRequest(url: string, response: Response): Request {
    return new Request(url, {
      ...response,
      method: response.type,
      headers: response.headers,
      body: response.body,
    });
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
    // Handle unauthorized errors before regular interceptors
    if (response.status === 401) {
      const refreshTokenValue = getCookie('refreshToken');

      const isLogoutEndpoint = response.url.includes('/auth/logout');

      if (refreshTokenValue && !isLogoutEndpoint) {
        try {
          // Get new tokens
          const authData = await authService.refreshToken(refreshTokenValue);

          // Update cookies with new tokens
          setCookie('accessToken', authData.accessToken);
          setCookie('refreshToken', authData.refreshToken);

          // Retry the original request with new token
          const originalRequest = this.buildOriginalRequest(response.url, response.clone());
          originalRequest.headers.set('Authorization', `Bearer ${authData.accessToken}`);

          // Make a new request with the updated token
          return await fetch(originalRequest).then((newResponse) =>
            this.processResponseInterceptors(newResponse),
          );
        } catch (error) {
          // If refresh fails, proceed with error
          console.error('Token refresh failed:', error);
        }
      }
    }

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
        const errorData: ApiReturn<any> = {
          status: response.status,
          message: data?.message || response.statusText || `HTTP error! status: ${response.status}`,
          data: data,
        };
        throw errorData;
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

  patch<T>(url: string, body: any, config?: RequestInit): Promise<T> {
    return this.fetch<T>(url, {
      ...config,
      method: 'PATCH',
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
    const accessToken = getCookie('accessToken');
    if (accessToken) {
      return {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${accessToken}`,
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
