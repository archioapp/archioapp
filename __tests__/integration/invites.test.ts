import { createMocks } from "node-mocks-http"
import { POST as createInviteHandler } from "@/app/api/invites/route"
import { GET as getInviteHandler } from "@/app/api/invites/[token]/route"
import { POST as acceptInviteHandler } from "@/app/api/invites/[token]/accept/route"
import jest from "jest"

jest.mock("@/lib/supabase/server")
jest.mock("@/lib/auth/db")

describe("Invites API Integration Tests", () => {
  describe("POST /api/invites", () => {
    it("should create room invite", async () => {
      const { req } = createMocks({
        method: "POST",
        body: {
          room_id: "room-123",
          email: "invitee@example.com",
          role: "member",
        },
      })

      const response = await createInviteHandler(req as any)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toHaveProperty("invite")
      expect(data.invite).toHaveProperty("code")
    })

    it("should enforce moderator role for inviting", async () => {
      const { req } = createMocks({
        method: "POST",
        body: {
          room_id: "room-123",
          email: "invitee@example.com",
        },
      })

      const response = await createInviteHandler(req as any)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toContain("permission")
    })
  })

  describe("GET /api/invites/[token]", () => {
    it("should get invite details", async () => {
      const { req } = createMocks({
        method: "GET",
      })

      const response = await getInviteHandler(req as any, { params: { token: "ABC123" } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty("invite")
    })

    it("should return 404 for invalid code", async () => {
      const { req } = createMocks({
        method: "GET",
      })

      const response = await getInviteHandler(req as any, { params: { token: "INVALID" } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe("Invite not found")
    })
  })

  describe("POST /api/invites/[token]/accept", () => {
    it("should accept invite and create membership", async () => {
      const { req } = createMocks({
        method: "POST",
      })

      const response = await acceptInviteHandler(req as any, { params: { token: "ABC123" } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty("membership")
      expect(data.message).toContain("accepted")
    })

    it("should reject expired invites", async () => {
      const { req } = createMocks({
        method: "POST",
      })

      const response = await acceptInviteHandler(req as any, { params: { token: "EXPIRED" } })
      const data = await response.json()

      expect(response.status).toBe(410)
      expect(data.error).toContain("expired")
    })
  })
})
