import { createMocks } from "node-mocks-http"
import { POST as signupHandler } from "@/app/api/auth/signup/route"
import { POST as loginHandler } from "@/app/api/auth/login/route"
import { POST as logoutHandler } from "@/app/api/auth/logout/route"
import { GET as meHandler } from "@/app/api/auth/me/route"
import jest from "jest" // Declare the jest variable

// Mock Supabase
jest.mock("@/lib/supabase/server", () => ({
  createServerClient: jest.fn(() => ({
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })),
  })),
}))

describe("Auth API Integration Tests", () => {
  describe("POST /api/auth/signup", () => {
    it("should create a new user account", async () => {
      const { req } = createMocks({
        method: "POST",
        body: {
          email: "test@example.com",
          password: "SecurePass123!",
          displayName: "Test User",
        },
      })

      const response = await signupHandler(req as any)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toHaveProperty("user")
      expect(data).toHaveProperty("profile")
    })

    it("should reject invalid email format", async () => {
      const { req } = createMocks({
        method: "POST",
        body: {
          email: "invalid-email",
          password: "SecurePass123!",
        },
      })

      const response = await signupHandler(req as any)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain("email")
    })

    it("should reject weak passwords", async () => {
      const { req } = createMocks({
        method: "POST",
        body: {
          email: "test@example.com",
          password: "123",
        },
      })

      const response = await signupHandler(req as any)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain("password")
    })
  })

  describe("POST /api/auth/login", () => {
    it("should authenticate valid credentials", async () => {
      const { req } = createMocks({
        method: "POST",
        body: {
          email: "test@example.com",
          password: "SecurePass123!",
        },
      })

      const response = await loginHandler(req as any)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty("user")
      expect(data).toHaveProperty("profile")
    })

    it("should reject invalid credentials", async () => {
      const { req } = createMocks({
        method: "POST",
        body: {
          email: "test@example.com",
          password: "WrongPassword",
        },
      })

      const response = await loginHandler(req as any)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBeDefined()
    })
  })

  describe("POST /api/auth/logout", () => {
    it("should sign out authenticated user", async () => {
      const { req } = createMocks({
        method: "POST",
      })

      const response = await logoutHandler(req as any)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Logged out successfully")
    })
  })

  describe("GET /api/auth/me", () => {
    it("should return current user profile", async () => {
      const { req } = createMocks({
        method: "GET",
      })

      const response = await meHandler(req as any)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty("user")
      expect(data).toHaveProperty("profile")
    })

    it("should return 401 for unauthenticated requests", async () => {
      const { req } = createMocks({
        method: "GET",
      })

      const response = await meHandler(req as any)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe("Unauthorized")
    })
  })
})
