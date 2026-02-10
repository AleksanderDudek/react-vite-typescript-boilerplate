import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PhotoGrid } from "@/components/PhotoGrid";
import { mockPhoto } from "../fixtures";

describe("PhotoGrid", () => {
  it("renders nothing when photos array is empty", () => {
    const { container } = render(<PhotoGrid photos={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders photos with correct alt text", () => {
    render(<PhotoGrid photos={[mockPhoto]} />);

    const img = screen.getByAltText("A beautiful mountain landscape");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", mockPhoto.src.medium);
  });

  it("renders photographer name in overlay", () => {
    render(<PhotoGrid photos={[mockPhoto]} />);

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("links to the photo page on Pexels", () => {
    render(<PhotoGrid photos={[mockPhoto]} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", mockPhoto.url);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("sets background color from avg_color", () => {
    render(<PhotoGrid photos={[mockPhoto]} />);

    const link = screen.getByRole("link");
    expect(link).toHaveStyle({ backgroundColor: mockPhoto.avg_color });
  });

  it("uses lazy loading on images", () => {
    render(<PhotoGrid photos={[mockPhoto]} />);

    const img = screen.getByAltText("A beautiful mountain landscape");
    expect(img).toHaveAttribute("loading", "lazy");
  });
});
