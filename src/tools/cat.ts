import type { Tool } from 'fastmcp'

import { createFetch, createSchema } from '@better-fetch/fetch'
import z from 'zod'

import { env } from '../env'
import { convertUrlToBase64 } from '../utils'

const catToolParametersSchema = z.object({
  numberOfCats: z.number().min(1).max(10).optional(),
})

const DEFAULT_NUMBER_OF_CATS = 1

export const catTool: Tool<undefined, typeof catToolParametersSchema> = {
  description: 'Get a cat image',
  execute: async ({ numberOfCats }) => {
    const { data, error } = await $fetch('/images/search', {
      headers: {
        'x-api-key': env.CAT_API_KEY,
      },
      query: {
        limit: numberOfCats ?? DEFAULT_NUMBER_OF_CATS,
      },
    })

    if (error) {
      throw new Error(error.message)
    }

    // Convert the URL to a base64 string
    const content = (
      await Promise.all(
        data.map(async (cat) => {
          const { base64: data, mimeType } = await convertUrlToBase64({ url: cat.url })
          return {
            data,
            mimeType,
            type: 'image' as const,
          }
        }),
      )
    ).filter((item) => item.data) // Remove items with no data

    return {
      content,
    }
  },
  name: 'cat',
  parameters: catToolParametersSchema,
}

/**
 * https://developers.thecatapi.com/view-account/ylX4blBYT9FaoVd6OhvR
 */
// API Query Parameters Schema
const catQuerySchema = z.object({
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
const catDataSchema = z.object({
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

const $fetch = createFetch({
  baseURL: 'https://api.thecatapi.com/v1',
  schema: createSchema({
    '/images/search': {
      output: z.array(catDataSchema),
      query: catQuerySchema,
    },
  }),
})
