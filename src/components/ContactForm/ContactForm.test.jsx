import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ContactForm from "./ContactForm.jsx";

describe("ContactForm", () => {
  it("only requires email and phone for an empty submission", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.click(screen.getByRole("button", { name: /request an estimate/i }));
    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
    expect(screen.getByText("Phone number is required.")).toBeInTheDocument();
    expect(screen.queryByText("First name is required.")).not.toBeInTheDocument();
    expect(screen.queryByText("Choose a project type.")).not.toBeInTheDocument();
  });
});
