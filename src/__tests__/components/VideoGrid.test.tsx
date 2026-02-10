import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { VideoGrid } from "@/components/VideoGrid";
import { mockVideo } from "../fixtures";

describe("VideoGrid", () => {
  it("renders nothing when videos array is empty", () => {
    const { container } = render(<VideoGrid videos={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders video with poster image", () => {
    render(<VideoGrid videos={[mockVideo]} />);

    const video = document.querySelector("video");
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute("poster", mockVideo.image);
  });

  it("renders author name with link", () => {
    render(<VideoGrid videos={[mockVideo]} />);

    const link = screen.getByRole("link", { name: "John Smith" });
    expect(link).toHaveAttribute("href", mockVideo.url);
  });

  it("displays video duration", () => {
    render(<VideoGrid videos={[mockVideo]} />);

    expect(screen.getByText("30s")).toBeInTheDocument();
  });

  it("sets video to muted and preload none", () => {
    render(<VideoGrid videos={[mockVideo]} />);

    const video = document.querySelector("video");
    expect(video).toHaveAttribute("preload", "none");
    expect(video?.muted).toBe(true);
  });
});
