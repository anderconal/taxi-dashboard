import { test, expect } from "@playwright/test";

test.describe("Trips Analysis", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders Trip Earnings by Pick-Up Date and Time Chart, supporting date filtering and deep linking", async ({ page }) => {
        const header = page.getByRole("heading", { name: "NYC Taxi Company" });
        await expect(header).toBeVisible();

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

        await expect(page.locator("canvas")).toHaveScreenshot();
    });
});
