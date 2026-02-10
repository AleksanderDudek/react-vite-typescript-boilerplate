import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "@/components/SearchBar";

describe("SearchBar", () => {
  const defaultProps = {
    onSearch: vi.fn(),
    loading: false,
  };

  it("renders the search input and submit button", () => {
    render(<SearchBar {...defaultProps} />);

    expect(screen.getByLabelText("Search query")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });

  it("renders media type toggle with Photos and Videos options", () => {
    render(<SearchBar {...defaultProps} />);

    expect(screen.getByRole("radio", { name: "Photos" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Videos" })).toBeInTheDocument();
  });

  it("calls onSearch with query and media type on submit", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar {...defaultProps} onSearch={onSearch} />);

    await user.type(screen.getByLabelText("Search query"), "mountains");
    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(onSearch).toHaveBeenCalledWith("mountains", "photos");
  });

  it("allows switching to videos before searching", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar {...defaultProps} onSearch={onSearch} />);

    await user.type(screen.getByLabelText("Search query"), "ocean");
    await user.click(screen.getByRole("radio", { name: "Videos" }));
    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(onSearch).toHaveBeenCalledWith("ocean", "videos");
  });

  it("disables submit button when input is empty", () => {
    render(<SearchBar {...defaultProps} />);

    expect(screen.getByRole("button", { name: "Search" })).toBeDisabled();
  });

  it("disables submit button when loading", async () => {
    const user = userEvent.setup();
    render(<SearchBar {...defaultProps} loading={true} />);

    await user.type(screen.getByLabelText("Search query"), "test");

    expect(screen.getByRole("button", { name: "Searching..." })).toBeDisabled();
  });

  it("does not call onSearch when submitting empty/whitespace query", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar {...defaultProps} onSearch={onSearch} />);

    await user.type(screen.getByLabelText("Search query"), "   ");
    // The button should be disabled since query.trim() is empty
    expect(screen.getByRole("button", { name: "Search" })).toBeDisabled();
  });
});
