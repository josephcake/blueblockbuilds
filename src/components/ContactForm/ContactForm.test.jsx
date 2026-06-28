import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ContactForm from "./ContactForm.jsx";

describe("ContactForm", () => {
  it("shows field errors for an empty submission", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.click(screen.getByRole("button", { name: /request an estimate/i }));
    expect(screen.getByText("First name is required.")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
    expect(screen.getByText("Choose a project type.")).toBeInTheDocument();
  });
});
