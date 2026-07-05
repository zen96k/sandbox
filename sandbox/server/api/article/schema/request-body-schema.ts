import { z } from "zod"

export const requestBodySchema = z.object({
  publisherId: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(15).default(15),
  offset: z.number().int().nonnegative().max(10000).optional()
})
