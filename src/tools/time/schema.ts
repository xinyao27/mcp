import { z } from 'zod'

export const catToolParametersSchema = z.object({
  numberOfCats: z.number().min(1).max(10).optional(),
})

/**
 * https://developers.thecatapi.com/view-account/ylX4blBYT9FaoVd6OhvR
 */

// API Query Parameters Schema
export const catQuerySchema = z.object({
  breed_ids: z.string().optional(),
  category_ids: z.string().optional(),
  has_breeds: z.boolean().optional(),
  limit: z.number().min(1).max(10).optional(),
  mime_types: z.enum(['jpg', 'png', 'gif']).optional(),
  order: z.enum(['RANDOM', 'ASC', 'DESC']).optional(),
  page: z.number().min(0).optional(),
  size: z.enum(['small', 'med', 'full']).optional(),
  sub_id: z.string().optional(),
})

// API Response Schema
export const catDataSchema = z.object({
  breeds: z
    .array(
      z.object({
        description: z.string(),
        id: z.string(),
        life_span: z.string(),
        name: z.string(),
        origin: z.string(),
        temperament: z.string(),
      }),
    )
    .optional(),
  height: z.number(),
  id: z.string(),
  url: z.string().url(),
  width: z.number(),
})
