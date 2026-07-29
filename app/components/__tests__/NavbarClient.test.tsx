import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import NavbarClient from "@/app/components/NavbarClient";
import { NAV_LINKS } from "@/lib/constants";

// Mock next/image — using <img> in mock is intentional; this replaces next/image for tests
// eslint-disable-next-line @next/next/no-img-element
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { width, height, alt = "", ...rest } = props;
    return <img width={width as number} height={height as number} alt={alt as string} {...rest} />;
  },
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    children,
    ...props
  }: { children: React.ReactNode; [key: string]: unknown }) => (
    <a {...props}>{children}</a>
  ),
}));

// Mock useScrollNav hook
vi.mock("@/app/hooks/useScrollNav", () => ({
  useScrollNav: () => ({
    isSolid: false,
    activeSection: "",
  }),
}));

describe("NavbarClient", () => {
  it("renders the hamburger button", () => {
    render(<NavbarClient />);

    const hamburger = screen.getByLabelText("Abrir menú");
    expect(hamburger).toBeInTheDocument();
    expect(hamburger).toHaveAttribute("aria-expanded", "false");
  });

  it("toggles aria-expanded when hamburger is clicked", async () => {
    const user = userEvent.setup();
    render(<NavbarClient />);

    const hamburger = screen.getByLabelText("Abrir menú");

    await user.click(hamburger);
    expect(hamburger).toHaveAttribute("aria-expanded", "true");

    await user.click(hamburger);
    expect(hamburger).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the menu when Escape key is pressed", async () => {
    const user = userEvent.setup();
    render(<NavbarClient />);

    const hamburger = screen.getByLabelText("Abrir menú");

    // Open menu
    await user.click(hamburger);
    expect(hamburger).toHaveAttribute("aria-expanded", "true");

    // Press Escape
    await user.keyboard("{Escape}");
    expect(hamburger).toHaveAttribute("aria-expanded", "false");
  });

  it("renders all nav links with correct text", () => {
    render(<NavbarClient />);

    NAV_LINKS.forEach((link) => {
      const anchors = screen.getAllByText(link.label);
      expect(anchors.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders the CTA link with contact title", () => {
    render(<NavbarClient />);

    const ctaLink = NAV_LINKS.find((l) => l.cta)!;
    const ctaAnchors = screen.getAllByTitle("Contáctanos");
    expect(ctaAnchors.length).toBeGreaterThanOrEqual(1);
    ctaAnchors.forEach((el) => {
      expect(el).toHaveTextContent(ctaLink.label);
    });
  });
});
