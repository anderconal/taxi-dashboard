import { test, expect } from "@playwright/test";

test.describe("Vite + TypeScript Starter UI", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the base URL where the app is running
    await page.goto("http://localhost:5173");
  });

  test("should display the correct initial count", async ({ page }) => {
    // Check that the count starts at 0
    const counter = page.locator("button");
    await expect(counter).toHaveText("count is 0");
  });

  test("should increment the count when button is clicked", async ({ page }) => {
    // Find the counter button
    const counter = page.locator("button");
    
    // Click the button
    await counter.click();
    
    // Check that the count increments
    await expect(counter).toHaveText("count is 1");
    
    // Click the button again
    await counter.click();
    
    // Check that the count increments again
    await expect(counter).toHaveText("count is 2");
  });
});
