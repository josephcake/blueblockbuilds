import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import WebGLFallback from "./WebGLFallback.jsx";

describe("WebGLFallback", () => {
  it("renders a static accessible fallback composition", () => {
    render(<WebGLFallback />);
    expect(screen.getByRole("img", { name: /renovation composition/i })).toBeInTheDocument();
  });
});
