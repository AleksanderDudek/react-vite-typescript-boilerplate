import { useCallback } from "react";
import { SearchBar, PhotoGrid, VideoGrid, ErrorMessage } from "@/components";
import { usePexelsSearch } from "@/hooks";
import type { MediaType } from "@/types";
import { config } from "@/utils/config";

export function HomePage() {
  const { photos, videos, loading, error, totalResults, hasMore, search, loadMore } =
    usePexelsSearch();

  const handleSearch = useCallback(
    (query: string, type: MediaType) => {
      search(query, type);
    },
    [search],
  );

  const hasResults = photos.length > 0 || videos.length > 0;

  return (
    <div className="home-page">
      <header className="home-page__header">
        <h1 className="home-page__title">{config.appTitle}</h1>
        <p className="home-page__subtitle">
          Discover stunning free photos and videos from{" "}
          <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer">
            Pexels
          </a>
        </p>
      </header>

      <SearchBar onSearch={handleSearch} loading={loading} />

      {error && <ErrorMessage error={error} />}

      {hasResults && (
        <p className="home-page__results-count">
          Showing {photos.length + videos.length} of {totalResults.toLocaleString()} results
        </p>
      )}

      <PhotoGrid photos={photos} />
      <VideoGrid videos={videos} />

      {hasMore && !loading && (
        <div className="home-page__load-more">
          <button className="home-page__load-more-btn" onClick={loadMore}>
            Load more
          </button>
        </div>
      )}

      {loading && hasResults && <p className="home-page__loading">Loading more...</p>}

      {!hasResults && !loading && !error && (
        <p className="home-page__empty">Search for something to get started ✨</p>
      )}

      <footer className="home-page__footer">
        <p>
          Photos and videos provided by{" "}
          <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer">
            Pexels
          </a>
        </p>
      </footer>
    </div>
  );
}
