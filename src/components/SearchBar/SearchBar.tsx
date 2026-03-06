import { useState } from "react";
import type { MediaType } from "@/types";
import { MEDIA_TYPE_OPTIONS, DEFAULT_MEDIA_TYPE, SEARCH_PLACEHOLDER } from "./SearchBar.consts";
import "./SearchBar.css";

interface SearchBarProps {
  onSearch: (query: string, type: MediaType) => void;
  loading: boolean;
}

export function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [mediaType, setMediaType] = useState<MediaType>(DEFAULT_MEDIA_TYPE);

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
          placeholder={SEARCH_PLACEHOLDER}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search query"
        />
        <div className="search-bar__controls">
          <div className="search-bar__toggle" role="radiogroup" aria-label="Media type">
            {MEDIA_TYPE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={mediaType === option.value}
                className={`search-bar__toggle-btn ${mediaType === option.value ? "active" : ""}`}
                onClick={() => setMediaType(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button type="submit" className="search-bar__submit" disabled={loading || !query.trim()}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>
    </form>
  );
}
