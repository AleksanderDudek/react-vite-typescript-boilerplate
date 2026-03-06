import type { PexelsPhoto } from "@/types";
import "./PhotoGrid.css";

interface PhotoGridProps {
  photos: PexelsPhoto[];
}

export function PhotoGrid({ photos }: PhotoGridProps) {
  if (photos.length === 0) return null;

  return (
    <div className="photo-grid" data-testid="photo-grid">
      {photos.map((photo) => (
        <a
          key={photo.id}
          href={photo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="photo-grid__item"
          style={{ backgroundColor: photo.avg_color }}
        >
          <img
            src={photo.src.medium}
            alt={photo.alt || `Photo by ${photo.photographer}`}
            loading="lazy"
            className="photo-grid__image"
          />
          <div className="photo-grid__overlay">
            <span className="photo-grid__photographer">{photo.photographer}</span>
          </div>
        </a>
      ))}
    </div>
  );
}
