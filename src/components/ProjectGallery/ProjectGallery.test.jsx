import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ProjectGallery from "./ProjectGallery.jsx";

describe("ProjectGallery", () => {
  it("moves through grouped projects as a carousel", async () => {
    const user = userEvent.setup();
    render(<ProjectGallery />);

    expect(screen.getByRole("heading", { name: "Kitchen" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Next project" }));
    expect(screen.getByRole("heading", { name: "Kitchen Island" })).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: /Living Space/i }));
    expect(screen.getByRole("heading", { name: "Living Space" })).toBeInTheDocument();
  });

  it("opens and closes the project modal", async () => {
    const user = userEvent.setup();
    render(<ProjectGallery />);

    await user.click(screen.getByRole("button", { name: /view project/i }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Kitchen")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close project details" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("moves between project images with left and right arrow keys", async () => {
    const user = userEvent.setup();
    render(<ProjectGallery />);

    await user.click(screen.getByRole("button", { name: /view project/i }));
    const dialog = screen.getByRole("dialog");

    expect(within(dialog).getByAltText("Kitchen main finished project view")).toBeInTheDocument();
    await user.keyboard("{ArrowRight}");
    expect(within(dialog).getByAltText("Kitchen cabinetry and countertop view")).toBeInTheDocument();
    await user.keyboard("{ArrowLeft}");
    expect(within(dialog).getByAltText("Kitchen main finished project view")).toBeInTheDocument();
  });
});
