import { test, expect } from "@playwright/test";

test.describe("StarWarsCrawl Component", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should render StarWarsCrawl initially", async ({ page }) => {
    // Check that the crawl section exists
    const crawlSection = page.locator("text=LUDOSPORT");
    await expect(crawlSection).toBeVisible();
  });

  test("should show 'Saltar intro' button when not skipped", async ({ page }) => {
    const skipButton = page.getByRole("button", { name: /saltar intro/i });
    await expect(skipButton).toBeVisible();
  });

  test("should hide entire crawl component after clicking skip button", async ({ page }) => {
    // Click skip button
    const skipButton = page.getByRole("button", { name: /saltar intro/i });
    await skipButton.click();

    // Wait for scroll animation
    await page.waitForTimeout(500);

    // BUG: The fixed panel should be completely hidden, but it remains visible
    // Check that the crawl text is NOT visible
    const crawlText = page.locator("text=LUDOSPORT");
    await expect(crawlText).not.toBeVisible({ timeout: 2000 });

    // Check that other sections are visible
    const misionVision = page.locator("text=MISIÓN");
    await expect(misionVision).toBeVisible();

    const valores = page.locator("text=VALORES");
    await expect(valores).toBeVisible();
  });

  test("should scroll to #propuesta section after skipping", async ({ page }) => {
    // Click skip button
    const skipButton = page.getByRole("button", { name: /saltar intro/i });
    await skipButton.click();

    // Wait for smooth scroll
    await page.waitForTimeout(1000);

    // Check that we scrolled to the propuesta section (Actividades)
    const actividadesSection = page.locator("#propuesta");
    await expect(actividadesSection).toBeInViewport();
  });

  test("should not show crawl overlay blocking the page after skip", async ({ page }) => {
    // Click skip button
    const skipButton = page.getByRole("button", { name: /saltar intro/i });
    await skipButton.click();

    await page.waitForTimeout(500);

    // BUG: The fixed overlay with z-40 remains visible, blocking other content
    // Check that we can interact with elements below the crawl
    const navbar = page.locator("nav").first();
    await expect(navbar).toBeVisible();

    // Try to click on a navbar link - should work if crawl is properly hidden
    const heroSection = page.locator("#hero");
    if (await heroSection.isVisible()) {
      await heroSection.scrollIntoViewIfNeeded();
      await expect(heroSection).toBeInViewport();
    }
  });

  test("should render all page sections after skipping", async ({ page }) => {
    // Click skip button
    const skipButton = page.getByRole("button", { name: /saltar intro/i });
    await skipButton.click();

    await page.waitForTimeout(500);

    // BUG: Only MapSection renders, other sections are blocked by the visible overlay
    const sections = [
      { name: "MISIÓN", selector: "text=MISIÓN" },
      { name: "VALORES", selector: "text=VALORES" },
      { name: "PROFESOR", selector: "text=PROFESOR" },
      { name: "ACTIVIDADES", selector: "text=ACTIVIDADES" },
      { name: "RANGOS", selector: "text=RANGOS" },
      { name: "FAQ", selector: "text=FAQ" },
      { name: "CONTACTO", selector: "text=CONTACTO" },
    ];

    for (const section of sections) {
      const element = page.locator(section.selector);
      await expect(element).toBeVisible({ timeout: 2000 });
    }
  });
});
