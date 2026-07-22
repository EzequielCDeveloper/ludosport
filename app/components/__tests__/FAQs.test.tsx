import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import FAQs from "@/app/components/FAQs";
import { FAQS } from "@/lib/constants";

describe("FAQs", () => {
  it("renders all FAQ items", () => {
    render(<FAQs />);

    FAQS.forEach((faq) => {
      expect(screen.getByText(faq.question)).toBeInTheDocument();
    });
  });

  it("toggles a <details> element open and closed on click", async () => {
    const user = userEvent.setup();
    render(<FAQs />);

    const firstDetails = screen.getAllByRole("group")[0];
    const firstSummary = firstDetails.querySelector("summary")!;

    // Initially closed
    expect(firstDetails).not.toHaveAttribute("open");

    // Click to open
    await user.click(firstSummary);
    expect(firstDetails).toHaveAttribute("open");

    // Click to close
    await user.click(firstSummary);
    expect(firstDetails).not.toHaveAttribute("open");
  });

  it("sets aria-hidden on the chevron icon", () => {
    render(<FAQs />);

    const chevrons = document.querySelectorAll("svg[aria-hidden='true']");
    expect(chevrons.length).toBeGreaterThanOrEqual(FAQS.length);
  });
});
