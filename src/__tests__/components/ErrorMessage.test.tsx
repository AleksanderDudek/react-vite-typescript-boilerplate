import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorMessage } from "@/components/ErrorMessage";

describe("ErrorMessage", () => {
  it("renders the error message", () => {
    render(<ErrorMessage error={{ message: "Network error" }} />);

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Network error")).toBeInTheDocument();
  });

  it("shows auth-specific message for 401 errors", () => {
    render(<ErrorMessage error={{ message: "Unauthorized", status: 401 }} />);

    expect(screen.getByText("Invalid API Key")).toBeInTheDocument();
    expect(
      screen.getByText("Please check your VITE_PEXELS_API_KEY in .env.local"),
    ).toBeInTheDocument();
  });

  it("shows auth-specific message for 403 errors", () => {
    render(<ErrorMessage error={{ message: "Forbidden", status: 403 }} />);

    expect(screen.getByText("Invalid API Key")).toBeInTheDocument();
  });

  it("renders retry button when onRetry is provided", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorMessage error={{ message: "Error" }} onRetry={onRetry} />);

    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("does not render retry button when onRetry is not provided", () => {
    render(<ErrorMessage error={{ message: "Error" }} />);

    expect(screen.queryByRole("button", { name: "Try again" })).not.toBeInTheDocument();
  });

  it("has the alert role for accessibility", () => {
    render(<ErrorMessage error={{ message: "Error" }} />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
