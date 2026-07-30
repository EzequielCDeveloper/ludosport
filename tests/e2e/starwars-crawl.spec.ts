import { test, expect } from "@playwright/test";

test.describe("StarWarsCrawl — static implementation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should render the crawl section with title", async ({ page }) => {
    const title = page.locator("#historia h2");
    await expect(title).toBeVisible();
    await expect(title).toHaveText("LUDOSPORT");
  });

  test("should render the subtitle", async ({ page }) => {
    const subtitle = page.locator("#historia p");
    await expect(subtitle.first()).toBeVisible();
    await expect(subtitle.first()).toHaveText("Ludo Sport Drake Academy");
  });

  test("should render all four narrative paragraphs", async ({ page }) => {
    const paragraphs = page.locator("#historia .space-y-10 p");
    await expect(paragraphs).toHaveCount(4);

    // First paragraph should be visible and contain the opening line
    const firstPara = paragraphs.first();
    await expect(firstPara).toBeVisible();
    await expect(firstPara).toContainText("En una época donde las pantallas");
  });

  test("should not block other page sections", async ({ page }) => {
    // The crawl is a static section — it should coexist with other sections
    const hero = page.locator("#hero");
    const misionVision = page.locator("#mision-vision");

    await expect(hero).toBeVisible();
    await misionVision.scrollIntoViewIfNeeded();
    await expect(misionVision).toBeVisible();
  });

  test("should render all page sections after the crawl", async ({ page }) => {
    const sections = [
      { id: "#hero", name: "Hero" },
      { id: "#historia", name: "Historia" },
      { id: "#mision-vision", name: "Misión/Visión" },
      { id: "#propuesta", name: "Valores" },
      { id: "#profesor", name: "Profesor" },
      { id: "#actividades", name: "Actividades" },
      { id: "#rangos", name: "Rangos" },
      { id: "#faqs", name: "FAQ" },
      { id: "#contacto", name: "Contacto" },
      { id: "#ubicacion", name: "Ubicación" },
    ];

    for (const { id, name } of sections) {
      const element = page.locator(id);
      await element.scrollIntoViewIfNeeded();
      await expect(element, `Section "${name}" should be visible`).toBeVisible({
        timeout: 3000,
      });
    }
  });

  test("should have a semantic section with correct id", async ({ page }) => {
    const section = page.locator("section#historia");
    await expect(section).toBeVisible();

    // Verify it's a proper semantic section
    const tagName = await section.evaluate((el) => el.tagName);
    expect(tagName).toBe("SECTION");
  });
});
