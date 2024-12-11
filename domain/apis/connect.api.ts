// connect.api.ts
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from "axios";
import { BlockRange, Event } from "../../types/event-types";
import env from "../../config/index";

type ApiConfig = {
  baseURL: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
};

class ApiService {
  private readonly api: AxiosInstance;
  private readonly retryAttempts: number;
  private readonly retryDelay: number;

  constructor(config: ApiConfig) {
    this.retryAttempts = config.retryAttempts || 3;
    this.retryDelay = config.retryDelay || 1000;

    this.api = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(
      (config) => {
        // Add any request modifications here
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: number;
        };

        if (error.response?.status === 429 || error.response?.status >= 500) {
          if (
            !originalRequest._retry ||
            originalRequest._retry < this.retryAttempts
          ) {
            originalRequest._retry = (originalRequest._retry || 0) + 1;

            await new Promise((resolve) =>
              setTimeout(resolve, this.retryDelay * originalRequest._retry!)
            );

            return this.api(originalRequest);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.get<T>(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError);
      throw error;
    }
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.api.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError);
      throw error;
    }
  }

  private handleError(error: AxiosError): void {
    if (error.response) {
      console.error(
        "Response error:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      console.error("Request error:", error.request);
    } else {
      console.error("Error:", error.message);
    }
  }
}
const apiConfig: ApiConfig = {
  baseURL: `http://${env.host}:${env.port}/api/v1/event`,
  timeout: 30000,
  retryAttempts: 1,
  retryDelay: 1000,
};

const apiService = new ApiService(apiConfig);

type ApiEndpoints = {
  getEventByBlock: (blockIdentifier: string) => Promise<Event[]>;
  createEvent: (event: Event) => Promise<Event>;
  getEventByTransaction: (transaction: string) => Promise<Event[]>;
  getEventByBlockNumberRange: (blockRange: BlockRange) => Promise<Event[]>;
};

const api: ApiEndpoints = {
  getEventByBlock: (blockIdentifier: string) =>
    apiService.get(`?block=${blockIdentifier}`),
  createEvent: (event: Event) => apiService.post("/", event),
  getEventByTransaction: (transaction: string) =>
    apiService.get(`/${transaction}`),
  getEventByBlockNumberRange: (blockRange: BlockRange) =>
    apiService.get(
      `/range?blockStart=${blockRange.blockStart}&blockEnd=${blockRange.blockEnd}`
    ),
};

export default api;
