import { createMocks } from "node-mocks-http"
import { GET as listRoomsHandler, POST as createRoomHandler } from "@/app/api/rooms/route"
import { PATCH as updateRoomHandler, DELETE as deleteRoomHandler } from "@/app/api/rooms/[id]/route"
import jest from "jest" // Importing jest to fix the undeclared variable error

jest.mock("@/lib/supabase/server")
jest.mock("@/lib/auth/db")

describe("Rooms API Integration Tests", () => {
  describe("GET /api/rooms", () => {
    it("should list rooms with org filter", async () => {
      const { req } = createMocks({
        method: "GET",
        query: { org_id: "org-123" },
      })

      const response = await listRoomsHandler(req as any)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty("rooms")
      expect(Array.isArray(data.rooms)).toBe(true)
    })
  })

  describe("POST /api/rooms", () => {
    it("should create new room", async () => {
      const { req } = createMocks({
        method: "POST",
        body: {
          org_id: "org-123",
          name: "Test Room",
          slug: "test-room",
          visibility: "public",
        },
      })

      const response = await createRoomHandler(req as any)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toHaveProperty("room")
      expect(data.room.name).toBe("Test Room")
    })

    it("should enforce creator role requirement", async () => {
      const { req } = createMocks({
        method: "POST",
        body: {
          org_id: "org-123",
          name: "Test Room",
          slug: "test-room",
        },
      })

      const response = await createRoomHandler(req as any)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toContain("creator")
    })
  })

  describe("PATCH /api/rooms/[id]", () => {
    it("should update room settings", async () => {
      const { req } = createMocks({
        method: "PATCH",
        body: {
          name: "Updated Room Name",
          visibility: "private",
        },
      })

      const response = await updateRoomHandler(req as any, { params: { id: "room-123" } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.room.name).toBe("Updated Room Name")
    })
  })

  describe("DELETE /api/rooms/[id]", () => {
    it("should delete room", async () => {
      const { req } = createMocks({
        method: "DELETE",
      })

      const response = await deleteRoomHandler(req as any, { params: { id: "room-123" } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Room deleted successfully")
    })
  })
})
