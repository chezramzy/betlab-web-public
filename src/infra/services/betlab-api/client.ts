import "server-only";

import { env } from "@/core/config/env";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface BetlabRequestInit extends RequestInit {
  method?: HttpMethod;
  searchParams?: Record<string, string | number | undefined>;
}

function buildUrl(path: string, searchParams?: Record<string, string | number | undefined>) {
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

export async function betlabFetch<TResponse>(
  path: string,
  init: BetlabRequestInit = {}
): Promise<TResponse> {
  const url = buildUrl(path, init.searchParams);
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    const error = new Error(`BetLab API error ${response.status}: ${response.statusText}`);
    console.error(error.message);
    throw error;
  }

  return (await response.json()) as TResponse;
}
