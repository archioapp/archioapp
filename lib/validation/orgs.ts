import { z } from "zod"

export const createOrgSchema = z.object({
  name: z.string().min(1, "Organization name is required").max(100),
  slug: z.string().min(3).max(50).optional(),
})

export const updateOrgSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(3).max(50).optional(),
})

export type CreateOrgInput = z.infer<typeof createOrgSchema>
export type UpdateOrgInput = z.infer<typeof updateOrgSchema>
