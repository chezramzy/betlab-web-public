/**
 * HTTP Service
 * Basé sur lib/core/services/http_service.dart
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ApiConfig } from '@/lib/core/config/api-config';

export class HttpService {
  private axiosInstance: AxiosInstance;
  private accessToken: string | null = null;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: `${ApiConfig.baseUrl}${ApiConfig.apiVersion}`,
      timeout: ApiConfig.defaultTimeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor with retry logic
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const config = error.config as AxiosRequestConfig & { _retry?: number };

        // Check if error status is in retry list
        const status = error.response?.status;
        if (
          status &&
          (ApiConfig.retry.retryOn as readonly number[]).includes(status)
        ) {
          config._retry = config._retry || 0;

          if (config._retry < ApiConfig.retry.maxRetries) {
            config._retry += 1;

            // Exponential backoff
            const delay = ApiConfig.retry.retryDelay * Math.pow(2, config._retry - 1);
            await new Promise((resolve) => setTimeout(resolve, delay));

            return this.axiosInstance(config);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.get(endpoint, config);
    return response.data;
  }

  async post<T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(endpoint, data, config);
    return response.data;
  }

  async put<T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.put(endpoint, data, config);
    return response.data;
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete(endpoint, config);
    return response.data;
  }
}

// Singleton instance
export const httpService = new HttpService();
