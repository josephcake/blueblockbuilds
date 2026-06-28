import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App.jsx";

describe("App reduced motion", () => {
  beforeEach(() => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }));
  });

  it("renders the static fallback when reduced motion is preferred", () => {
    render(<App />);
    expect(document.querySelector("[aria-label='Abstract kitchen and bathroom renovation composition']")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "We build spaces worth living in." })).toBeInTheDocument();
  });
});
