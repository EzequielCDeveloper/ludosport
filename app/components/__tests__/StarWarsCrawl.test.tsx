import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StarWarsCrawl from "../StarWarsCrawl";

describe("StarWarsCrawl Component", () => {
  it("should render LUDOSPORT title", () => {
    render(<StarWarsCrawl />);
    expect(screen.getByText("LUDOSPORT")).toBeInTheDocument();
  });

  it("should render Drake Academy subtitle", () => {
    render(<StarWarsCrawl />);
    expect(screen.getByText("Drake Academy")).toBeInTheDocument();
  });

  it("should render all content paragraphs", () => {
    render(<StarWarsCrawl />);
    
    expect(screen.getByText(/En una época donde las pantallas dominan/)).toBeInTheDocument();
    expect(screen.getByText(/Encontrar actividades que promuevan/)).toBeInTheDocument();
    expect(screen.getByText(/Por ello nace Drake Academy/)).toBeInTheDocument();
    expect(screen.getByText(/Una disciplina deportiva moderna/)).toBeInTheDocument();
  });

  it("should NOT have skip button", () => {
    render(<StarWarsCrawl />);
    
    const skipButton = screen.queryByRole("button", {
      name: /saltar/i,
    });
    expect(skipButton).not.toBeInTheDocument();
  });

  it("should NOT have fixed overlay", () => {
    render(<StarWarsCrawl />);
    
    const fixedOverlay = document.querySelector(".fixed.inset-0");
    expect(fixedOverlay).not.toBeInTheDocument();
  });

  it("should render as static section", () => {
    render(<StarWarsCrawl />);
    
    const section = document.querySelector("section.py-24.bg-black");
    expect(section).toBeInTheDocument();
  });

  it("should have Star Wars styling on title", () => {
    render(<StarWarsCrawl />);
    
    const title = screen.getByText("LUDOSPORT");
    expect(title).toHaveClass("font-star-jedi");
    expect(title).toHaveClass("text-[var(--color-yellow)]");
  });

  it("should have Star Wars styling on subtitle", () => {
    render(<StarWarsCrawl />);
    
    const subtitle = screen.getByText("Drake Academy");
    expect(subtitle).toHaveClass("font-display");
    expect(subtitle).toHaveClass("text-[var(--color-yellow)]");
  });

  it("should have Star Wars styling on content paragraphs", () => {
    render(<StarWarsCrawl />);
    
    const paragraphs = screen.getAllByText(/./).filter(el => 
      el.textContent?.includes("En una época") || 
      el.textContent?.includes("Encontrar actividades") ||
      el.textContent?.includes("Por ello nace") ||
      el.textContent?.includes("Una disciplina")
    );
    
    paragraphs.forEach(p => {
      expect(p).toHaveClass("font-body");
      expect(p).toHaveClass("text-[var(--color-yellow)]");
    });
  });
});
