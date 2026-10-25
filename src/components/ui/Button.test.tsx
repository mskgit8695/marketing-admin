import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders with default primary style and children", () => {
    render(<Button>Click Me</Button>);
    const btn = screen.getByRole("button", { name: /click me/i });
    expect(btn).toBeInTheDocument();
    expect(btn).not.toBeDisabled();
  });

  it("handles user clicks and invokes onClick handler", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Submit</Button>);
    const btn = screen.getByRole("button", { name: /submit/i });

    await user.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("disables button when disabled prop is true", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button disabled onClick={handleClick}>Disabled Button</Button>);
    const btn = screen.getByRole("button", { name: /disabled button/i });

    expect(btn).toBeDisabled();
    await user.click(btn);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("disables button and shows spinner when isLoading is true", () => {
    render(<Button isLoading>Saving Changes</Button>);
    const btn = screen.getByRole("button");

    expect(btn).toBeDisabled();
    expect(btn.querySelector("svg.animate-spin")).toBeInTheDocument();
  });
});
