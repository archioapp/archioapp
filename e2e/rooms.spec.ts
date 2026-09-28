import { test, expect } from "@playwright/test"

test.describe("Room Management", () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to org
    await page.goto("/auth/login")
    await page.fill('input[name="email"]', "test@example.com")
    await page.fill('input[name="password"]', "SecurePass123!")
    await page.click('button[type="submit"]')
    await page.goto("/orgs/test-org")
  })

  test("should create new room", async ({ page }) => {
    await page.click('button:has-text("Create Room")')

    // Fill room form
    await page.fill('input[name="name"]', "Test Room")
    await page.fill('input[name="slug"]', "test-room")
    await page.selectOption('select[name="visibility"]', "public")

    // Submit form
    await page.click('button[type="submit"]')

    // Should show room in list
    await expect(page.locator("text=Test Room")).toBeVisible()
  })

  test("should join public room", async ({ page }) => {
    await page.goto("/rooms/public-room")

    // Click join button
    await page.click('button:has-text("Join Room")')

    // Should show success and room content
    await expect(page.locator("text=You joined")).toBeVisible()
    await expect(page.locator('[data-testid="room-content"]')).toBeVisible()
  })

  test("should invite member to room", async ({ page }) => {
    await page.goto("/rooms/test-room/settings")

    // Navigate to members tab
    await page.click('button:has-text("Members")')

    // Click invite button
    await page.click('button:has-text("Invite Member")')

    // Fill invite form
    await page.fill('input[name="email"]', "newmember@example.com")
    await page.selectOption('select[name="role"]', "member")
    await page.click('button:has-text("Send Invite")')

    // Should show success
    await expect(page.locator("text=Invite sent")).toBeVisible()
  })
})
