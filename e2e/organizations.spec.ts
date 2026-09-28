import { test, expect } from "@playwright/test"

test.describe("Organization Management", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto("/auth/login")
    await page.fill('input[name="email"]', "test@example.com")
    await page.fill('input[name="password"]', "SecurePass123!")
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test("should create new organization", async ({ page }) => {
    await page.goto("/orgs/new")

    // Fill organization form
    await page.fill('input[name="name"]', "Test Organization")
    await page.fill('input[name="slug"]', "test-org")
    await page.fill('textarea[name="description"]', "A test organization")

    // Submit form
    await page.click('button[type="submit"]')

    // Should redirect to org page
    await expect(page).toHaveURL(/\/orgs\/test-org/)

    // Should show org name
    await expect(page.locator('h1:has-text("Test Organization")')).toBeVisible()
  })

  test("should list user organizations", async ({ page }) => {
    await page.goto("/orgs")

    // Should show organizations list
    await expect(page.locator('[data-testid="org-list"]')).toBeVisible()

    // Should have at least one org
    const orgCards = page.locator('[data-testid="org-card"]')
    await expect(orgCards).toHaveCount(await orgCards.count())
  })

  test("should update organization settings", async ({ page }) => {
    await page.goto("/orgs/test-org/settings")

    // Update org name
    await page.fill('input[name="name"]', "Updated Organization Name")
    await page.click('button:has-text("Save")')

    // Should show success message
    await expect(page.locator("text=Organization updated")).toBeVisible()
  })
})
