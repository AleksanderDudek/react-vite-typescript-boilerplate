import type { PexelsVideo } from "@/types";
import "./VideoGrid.css";

interface VideoGridProps {
  videos: PexelsVideo[];
}

export function VideoGrid({ videos }: VideoGridProps) {
  if (videos.length === 0) return null;

  return (
    <div className="video-grid" data-testid="video-grid">
      {videos.map((video) => {
        const previewFile = video.video_files.find(
          (f) => f.quality === "sd" || f.quality === "hd",
        );

        return (
          <div key={video.id} className="video-grid__item">
            <video
              className="video-grid__player"
              poster={video.image}
              controls
              preload="none"
              muted
            >
              {previewFile && <source src={previewFile.link} type={previewFile.file_type} />}
              Your browser does not support the video tag.
            </video>
            <div className="video-grid__info">
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="video-grid__author"
              >
                {video.user.name}
              </a>
              <span className="video-grid__duration">{video.duration}s</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
