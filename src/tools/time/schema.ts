import { z } from 'zod'

export const timeToolParametersSchema = z.object({
  timezone: z.string().optional(),
})
