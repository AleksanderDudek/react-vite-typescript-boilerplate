import { useState } from "react";
import type { MediaType } from "@/types";
import "./SearchBar.css";

interface SearchBarProps {
  onSearch: (query: string, type: MediaType) => void;
  loading: boolean;
}

export function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [mediaType, setMediaType] = useState<MediaType>("photos");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), mediaType);
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-bar__input-group">
        <input
          type="text"
          className="search-bar__input"
          placeholder="Search for photos & videos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search query"
        />
        <div className="search-bar__controls">
          <div className="search-bar__toggle" role="radiogroup" aria-label="Media type">
            <button
              type="button"
              role="radio"
              aria-checked={mediaType === "photos"}
              className={`search-bar__toggle-btn ${mediaType === "photos" ? "active" : ""}`}
              onClick={() => setMediaType("photos")}
            >
              Photos
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={mediaType === "videos"}
              className={`search-bar__toggle-btn ${mediaType === "videos" ? "active" : ""}`}
              onClick={() => setMediaType("videos")}
            >
              Videos
            </button>
          </div>
          <button type="submit" className="search-bar__submit" disabled={loading || !query.trim()}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>
    </form>
  );
}
