import type { MediaType } from "@/types";

export const MEDIA_TYPE_OPTIONS: { value: MediaType; label: string }[] = [
  { value: "photos", label: "Photos" },
  { value: "videos", label: "Videos" },
];

export const DEFAULT_MEDIA_TYPE: MediaType = "photos";

export const SEARCH_PLACEHOLDER = "Search for photos & videos...";
