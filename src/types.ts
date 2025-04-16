import type { CallToolResultSchema } from '@modelcontextprotocol/sdk/types.js'
import type { StandardSchemaV1 } from '@standard-schema/spec'

import { AudioContentSchema, ImageContentSchema, TextContentSchema } from '@modelcontextprotocol/sdk/types.js'
import { z } from 'zod'

export const ContentSchema = z.discriminatedUnion('type', [TextContentSchema, ImageContentSchema, AudioContentSchema])

export const ErrorContentSchema = z.object({
  content: z.array(ContentSchema),
  isError: z.boolean(),
})

export type ErrorContent = z.infer<typeof ErrorContentSchema>

export type Tool<Parameters extends ToolParameters = ToolParameters> = {
  description?: string
  execute: (args: StandardSchemaV1.InferOutput<Parameters>) => Promise<ToolResult>
  name: string
  parameters?: Parameters
}

export type ToolParameters = StandardSchemaV1

export type ToolResult = z.infer<typeof CallToolResultSchema>

export { AudioContentSchema, ImageContentSchema, TextContentSchema }
