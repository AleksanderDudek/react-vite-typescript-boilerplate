import { config } from "@/utils/config";
import type {
  PexelsPhotoResponse,
  PexelsVideoResponse,
  SearchParams,
  ApiError,
} from "@/types";

// ============================================================
// Pexels API Client
// ============================================================
// A typed, minimal API client for the Pexels API.
// Handles authentication, error mapping, and response typing.
// ============================================================

const DEFAULT_PER_PAGE = 15;

class PexelsApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "PexelsApiError";
    this.status = status;
  }
}

async function pexelsFetch<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${config.apiBaseUrl}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: config.pexelsApiKey,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "Unknown error");
    throw new PexelsApiError(
      `Pexels API error (${response.status}): ${errorBody}`,
      response.status,
    );
  }

  return response.json() as Promise<T>;
}

// --- Photos ---

export async function searchPhotos(params: SearchParams): Promise<PexelsPhotoResponse> {
  return pexelsFetch<PexelsPhotoResponse>("/v1/search", {
    query: params.query,
    page: String(params.page),
    per_page: String(params.per_page || DEFAULT_PER_PAGE),
    ...(params.orientation && { orientation: params.orientation }),
  });
}

export async function getCuratedPhotos(
  page = 1,
  perPage = DEFAULT_PER_PAGE,
): Promise<PexelsPhotoResponse> {
  return pexelsFetch<PexelsPhotoResponse>("/v1/curated", {
    page: String(page),
    per_page: String(perPage),
  });
}

// --- Videos ---

export async function searchVideos(params: SearchParams): Promise<PexelsVideoResponse> {
  return pexelsFetch<PexelsVideoResponse>("/videos/search", {
    query: params.query,
    page: String(params.page),
    per_page: String(params.per_page || DEFAULT_PER_PAGE),
    ...(params.orientation && { orientation: params.orientation }),
  });
}

export async function getPopularVideos(
  page = 1,
  perPage = DEFAULT_PER_PAGE,
): Promise<PexelsVideoResponse> {
  return pexelsFetch<PexelsVideoResponse>("/videos/popular", {
    page: String(page),
    per_page: String(perPage),
  });
}

// --- Error Helper ---

export function toApiError(error: unknown): ApiError {
  if (error instanceof PexelsApiError) {
    return { message: error.message, status: error.status };
  }
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: "An unexpected error occurred" };
}
