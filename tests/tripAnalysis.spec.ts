import { test, expect } from "@playwright/test";

test.describe("Trips Analysis", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders NYC Taxi Company heading, navigation and footer", async ({ page }) => {
    const heading = page.getByRole("heading", { name: "NYC Taxi Company" });
    await expect(heading).toBeVisible();

    const navigation = page.getByRole("navigation");
    await expect(navigation).toBeVisible();

    const dashboardLink = page.getByRole("link", {
      name: /dashboard/i
    });
    await expect(dashboardLink).toBeVisible();

    const reportsLink = page.getByRole("link", {
      name: /reports/i
    });
    await expect(reportsLink).toBeVisible();

    const settingsLink = page.getByRole("link", {
      name: /settings/i
    });
    await expect(settingsLink).toBeVisible();

    const footer = page.getByRole("contentinfo");
    await expect(footer).toBeVisible();

    const footerText = page.getByText("© 2024 NYC Taxi Company");
    await expect(footerText).toBeVisible();
  });

  test("renders Trip Earnings by Pick-Up Date and Time Chart, supporting date filtering and deep linking", async ({ page }) => {
        const filterLabel = page.getByText("Filter by Date:");
        await expect(filterLabel).toBeVisible();

        const datePicker = page.getByLabel("Filter by Date:");
        await expect(datePicker).toBeVisible();

        await datePicker.fill("2017-01-03");
        await datePicker.press("Enter");
        await expect(page).toHaveURL(/.*\?date=2017-01-03/);

        await page.goto("http://localhost:5173/?date=2016-12-31");
        await expect(datePicker).toHaveValue("2016-12-31");
        await expect(page).toHaveURL(/.*\?date=2016-12-31/);

        await expect(page.locator("canvas").last()).toHaveScreenshot();
    });

    test("renders Average Net Margin per Route Bar Chart, supporting profit category filtering and deep linking", async ({ page }) => {
      const filterLabel = page.getByText("Filter by Profit Category:");
      await expect(filterLabel).toBeVisible();
  
      const categoryFilter = page.getByLabel("Filter by Profit Category:");
      await expect(categoryFilter).toBeVisible();
  
      await categoryFilter.selectOption("Medium");
      
      await expect(page).toHaveURL(/.*\?(date=.*&)?profitCategory=medium(&date=.*)?/i);
  
      await page.goto("http://localhost:5173/?date=2016-12-31&profitCategory=low");
      await expect(categoryFilter).toHaveValue("low");
      await expect(page).toHaveURL(/.*\?(date=.*&)?profitCategory=low(&date=.*)?/i);
  
      await expect(page.locator("canvas").first()).toHaveScreenshot();
    });
});
