import "server-only";

import type { HttpClient, HttpRequestOptions, HttpResponse } from "@/core/http/client";
import { env } from "@/core/config/env";

function buildUrl(
  path: string,
  searchParams?: Record<string, string | number | boolean | undefined>
) {
  const url = new URL(path.replace(/^\//, ""), env.NEXT_PUBLIC_API_BASE_URL);
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

async function executeRequest<TResponse, TBody = unknown>(
  path: string,
  options: HttpRequestOptions<TBody> = {}
): Promise<HttpResponse<TResponse>> {
  const { method = "GET", headers, body, searchParams } = options;
  const url = buildUrl(path, searchParams);

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: method === "GET" ? "force-cache" : undefined,
  });

  const data = (await response.json()) as TResponse;

  if (!response.ok) {
    const error = new Error(`BetLab API error ${response.status}: ${response.statusText}`);
    console.error(error.message, data);
    throw error;
  }

  return {
    ok: true,
    status: response.status,
    data,
  } satisfies HttpResponse<TResponse>;
}

export const betlabHttpClient: HttpClient = {
  async request<TResponse, TBody = unknown>(
    path: string,
    options?: HttpRequestOptions<TBody>
  ): Promise<HttpResponse<TResponse>> {
    return executeRequest<TResponse, TBody>(path, options);
  },
};

export async function betlabFetch<TResponse, TBody = unknown>(
  path: string,
  options?: HttpRequestOptions<TBody>
): Promise<TResponse> {
  const response = await betlabHttpClient.request<TResponse, TBody>(path, options);
  return response.data;
}
