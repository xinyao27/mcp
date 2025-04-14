import type { Tool } from 'fastmcp'

import { createFetch, createSchema } from '@better-fetch/fetch'
import { imageContent } from 'fastmcp'
import z from 'zod'

import { env } from '../../env'
import { catDataSchema, catQuerySchema, catToolParametersSchema } from './schema'

const DEFAULT_NUMBER_OF_CATS = 1

export const catTool: Tool<undefined, typeof catToolParametersSchema> = {
  description: 'Get a cat image',
  execute: async ({ numberOfCats }, { log }) => {
    log.info(`Getting ${numberOfCats ?? DEFAULT_NUMBER_OF_CATS} cat image`)

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

    log.info(`Found ${data.length} cat image`)

    // Convert the URL to a base64 string
    const content = await Promise.all(data.map(async (cat) => imageContent({ url: cat.url })))

    return {
      content,
    }
  },
  name: 'cat',
  parameters: catToolParametersSchema,
}

const $fetch = createFetch({
  baseURL: 'https://api.thecatapi.com/v1',
  schema: createSchema({
    '/images/search': {
      output: z.array(catDataSchema),
      query: catQuerySchema,
    },
  }),
})
