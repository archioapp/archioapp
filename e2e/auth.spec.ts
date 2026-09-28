import { test, expect } from "@playwright/test"

test.describe("Authentication Flow", () => {
  test("should complete signup flow", async ({ page }) => {
    await page.goto("/auth/signup")

    // Fill signup form
    await page.fill('input[name="email"]', "newuser@example.com")
    await page.fill('input[name="password"]', "SecurePass123!")
    await page.fill('input[name="displayName"]', "New User")

    // Submit form
    await page.click('button[type="submit"]')

    // Should redirect to success page or dashboard
    await expect(page).toHaveURL(/\/(dashboard|auth\/sign-up-success)/)

    // Should show success message
    await expect(page.locator("text=Welcome")).toBeVisible()
  })

  test("should complete login flow", async ({ page }) => {
    await page.goto("/auth/login")

    // Fill login form
    await page.fill('input[name="email"]', "test@example.com")
    await page.fill('input[name="password"]', "SecurePass123!")

    // Submit form
    await page.click('button[type="submit"]')

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/)

    // Should show user menu
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible()
  })

  test("should show validation errors", async ({ page }) => {
    await page.goto("/auth/signup")

    // Submit empty form
    await page.click('button[type="submit"]')

    // Should show validation errors
    await expect(page.locator("text=Email is required")).toBeVisible()
    await expect(page.locator("text=Password is required")).toBeVisible()
  })

  test("should handle logout", async ({ page }) => {
    // Login first
    await page.goto("/auth/login")
    await page.fill('input[name="email"]', "test@example.com")
    await page.fill('input[name="password"]', "SecurePass123!")
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/\/dashboard/)

    // Logout
    await page.click('[data-testid="user-menu"]')
    await page.click("text=Logout")

    // Should redirect to login
    await expect(page).toHaveURL(/\/auth\/login/)
  })
})
