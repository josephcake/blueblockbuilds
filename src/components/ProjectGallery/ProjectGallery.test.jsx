import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ProjectGallery from "./ProjectGallery.jsx";

describe("ProjectGallery", () => {
  it("filters projects and opens/closes the project modal", async () => {
    const user = userEvent.setup();
    render(<ProjectGallery />);
    await user.click(screen.getByRole("tab", { name: "Bathroom" }));
    expect(screen.getByText("Spa-Inspired Primary Bathroom")).toBeInTheDocument();
    expect(screen.queryByText("Modern Kitchen Renovation")).not.toBeInTheDocument();

    await user.click(screen.getAllByRole("button", { name: /view project/i })[0]);
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Spa-Inspired Primary Bathroom")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
