import { createMocks } from "node-mocks-http"
import { GET as listOrgsHandler, POST as createOrgHandler } from "@/app/api/orgs/route"
import { GET as getOrgHandler, PATCH as updateOrgHandler, DELETE as deleteOrgHandler } from "@/app/api/orgs/[id]/route"
import jest from "jest" // Declare the jest variable

jest.mock("@/lib/supabase/server")
jest.mock("@/lib/auth/db")

describe("Organizations API Integration Tests", () => {
  describe("GET /api/orgs", () => {
    it("should list user organizations", async () => {
      const { req } = createMocks({
        method: "GET",
      })

      const response = await listOrgsHandler(req as any)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty("organizations")
      expect(Array.isArray(data.organizations)).toBe(true)
    })
  })

  describe("POST /api/orgs", () => {
    it("should create new organization", async () => {
      const { req } = createMocks({
        method: "POST",
        body: {
          name: "Test Organization",
          slug: "test-org",
        },
      })

      const response = await createOrgHandler(req as any)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toHaveProperty("organization")
      expect(data.organization.name).toBe("Test Organization")
    })

    it("should reject duplicate slugs", async () => {
      const { req } = createMocks({
        method: "POST",
        body: {
          name: "Test Organization",
          slug: "existing-slug",
        },
      })

      const response = await createOrgHandler(req as any)
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toContain("slug")
    })
  })

  describe("GET /api/orgs/[id]", () => {
    it("should get organization details", async () => {
      const { req } = createMocks({
        method: "GET",
      })

      const response = await getOrgHandler(req as any, { params: { id: "org-123" } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty("organization")
    })

    it("should return 404 for non-existent org", async () => {
      const { req } = createMocks({
        method: "GET",
      })

      const response = await getOrgHandler(req as any, { params: { id: "non-existent" } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe("Organization not found")
    })
  })

  describe("PATCH /api/orgs/[id]", () => {
    it("should update organization", async () => {
      const { req } = createMocks({
        method: "PATCH",
        body: {
          name: "Updated Name",
        },
      })

      const response = await updateOrgHandler(req as any, { params: { id: "org-123" } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.organization.name).toBe("Updated Name")
    })

    it("should reject non-admin updates", async () => {
      const { req } = createMocks({
        method: "PATCH",
        body: {
          name: "Updated Name",
        },
      })

      const response = await updateOrgHandler(req as any, { params: { id: "org-123" } })
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toContain("permission")
    })
  })

  describe("DELETE /api/orgs/[id]", () => {
    it("should delete organization", async () => {
      const { req } = createMocks({
        method: "DELETE",
      })

      const response = await deleteOrgHandler(req as any, { params: { id: "org-123" } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Organization deleted successfully")
    })
  })
})
