import { z } from "zod"

export const requestBodySchema = z.object({
  publisherId: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  offset: z.number().int().nonnegative().optional()
})
