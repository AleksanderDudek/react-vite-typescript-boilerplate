import { useState, useCallback, useEffect, useRef } from "react";
import { searchPhotos, searchVideos, getCuratedPhotos, getPopularVideos, toApiError } from "@/api";
import type {
  PexelsPhoto,
  PexelsVideo,
  MediaType,
  ApiError,
  PexelsPhotoResponse,
  PexelsVideoResponse,
} from "@/types";

const PER_PAGE = 15;

interface UsePexelsSearchResult {
  photos: PexelsPhoto[];
  videos: PexelsVideo[];
  loading: boolean;
  error: ApiError | null;
  totalResults: number;
  page: number;
  hasMore: boolean;
  search: (query: string, type: MediaType) => Promise<void>;
  loadMore: () => Promise<void>;
  reset: () => void;
}

export function usePexelsSearch(): UsePexelsSearchResult {
  const [photos, setPhotos] = useState<PexelsPhoto[]>([]);
  const [videos, setVideos] = useState<PexelsVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);

  const queryRef = useRef("");
  const mediaTypeRef = useRef<MediaType>("photos");

  const hasMore = photos.length + videos.length < totalResults;

  const reset = useCallback(() => {
    setPhotos([]);
    setVideos([]);
    setError(null);
    setTotalResults(0);
    setPage(1);
    queryRef.current = "";
  }, []);

  const search = useCallback(
    async (query: string, type: MediaType) => {
      if (!query.trim()) return;

      queryRef.current = query;
      mediaTypeRef.current = type;
      setLoading(true);
      setError(null);
      setPhotos([]);
      setVideos([]);
      setPage(1);

      try {
        if (type === "photos") {
          const data = await searchPhotos({ query, page: 1, per_page: PER_PAGE });
          setPhotos(data.photos);
          setTotalResults(data.total_results);
        } else {
          const data = await searchVideos({ query, page: 1, per_page: PER_PAGE });
          setVideos(data.videos);
          setTotalResults(data.total_results);
        }
      } catch (err) {
        setError(toApiError(err));
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    const nextPage = page + 1;
    setLoading(true);

    try {
      if (mediaTypeRef.current === "photos") {
        const data: PexelsPhotoResponse = queryRef.current
          ? await searchPhotos({ query: queryRef.current, page: nextPage, per_page: PER_PAGE })
          : await getCuratedPhotos(nextPage, PER_PAGE);
        setPhotos((prev) => [...prev, ...data.photos]);
        setTotalResults(data.total_results);
      } else {
        const data: PexelsVideoResponse = queryRef.current
          ? await searchVideos({ query: queryRef.current, page: nextPage, per_page: PER_PAGE })
          : await getPopularVideos(nextPage, PER_PAGE);
        setVideos((prev) => [...prev, ...data.videos]);
        setTotalResults(data.total_results);
      }
      setPage(nextPage);
    } catch (err) {
      setError(toApiError(err));
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]);

  return { photos, videos, loading, error, totalResults, page, hasMore, search, loadMore, reset };
}

// --- Debounce Hook ---

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
