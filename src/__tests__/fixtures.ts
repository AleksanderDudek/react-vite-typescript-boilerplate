import type { PexelsPhoto, PexelsVideo, PexelsPhotoResponse, PexelsVideoResponse } from "@/types";

export const mockPhoto: PexelsPhoto = {
  id: 12345,
  width: 4000,
  height: 3000,
  url: "https://www.pexels.com/photo/12345/",
  photographer: "Jane Doe",
  photographer_url: "https://www.pexels.com/@janedoe",
  photographer_id: 1,
  avg_color: "#4A6741",
  src: {
    original: "https://images.pexels.com/photos/12345/original.jpeg",
    large2x: "https://images.pexels.com/photos/12345/large2x.jpeg",
    large: "https://images.pexels.com/photos/12345/large.jpeg",
    medium: "https://images.pexels.com/photos/12345/medium.jpeg",
    small: "https://images.pexels.com/photos/12345/small.jpeg",
    portrait: "https://images.pexels.com/photos/12345/portrait.jpeg",
    landscape: "https://images.pexels.com/photos/12345/landscape.jpeg",
    tiny: "https://images.pexels.com/photos/12345/tiny.jpeg",
  },
  liked: false,
  alt: "A beautiful mountain landscape",
};

export const mockVideo: PexelsVideo = {
  id: 67890,
  width: 1920,
  height: 1080,
  url: "https://www.pexels.com/video/67890/",
  image: "https://images.pexels.com/videos/67890/poster.jpeg",
  duration: 30,
  user: {
    id: 2,
    name: "John Smith",
    url: "https://www.pexels.com/@johnsmith",
  },
  video_files: [
    {
      id: 1,
      quality: "hd",
      file_type: "video/mp4",
      width: 1920,
      height: 1080,
      fps: 30,
      link: "https://videos.pexels.com/67890/hd.mp4",
    },
  ],
  video_pictures: [
    {
      id: 1,
      picture: "https://images.pexels.com/videos/67890/pic-1.jpeg",
      nr: 0,
    },
  ],
};

export const mockPhotoResponse: PexelsPhotoResponse = {
  total_results: 100,
  page: 1,
  per_page: 15,
  photos: [mockPhoto],
  next_page: "https://api.pexels.com/v1/search?page=2&per_page=15&query=nature",
};

export const mockVideoResponse: PexelsVideoResponse = {
  total_results: 50,
  page: 1,
  per_page: 15,
  videos: [mockVideo],
  next_page: "https://api.pexels.com/videos/search?page=2&per_page=15&query=ocean",
};
