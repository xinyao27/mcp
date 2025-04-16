import type { CallToolResultSchema } from '@modelcontextprotocol/sdk/types.js'

import { AudioContentSchema, ImageContentSchema, TextContentSchema } from '@modelcontextprotocol/sdk/types.js'
import { z } from 'zod'

export const ContentSchema = z.discriminatedUnion('type', [TextContentSchema, ImageContentSchema, AudioContentSchema])

export const ErrorContentSchema = z.object({
  content: z.array(ContentSchema),
  isError: z.boolean(),
})

export type ErrorContent = z.infer<typeof ErrorContentSchema>

export interface Server {
  name: string
  tools: Tool[]
  transport?: 'http-streamable' | 'stdio'
  version: `${number}.${number}.${number}`
}

export type Tool<P extends ToolParameters = ToolParameters> = {
  description?: string
  execute: (args: z.infer<P>) => Promise<ToolResult>
  name: string
  parameters?: P
}

export { AudioContentSchema, ImageContentSchema, TextContentSchema }

export type ToolParameters = z.ZodType

export type ToolResult = z.infer<typeof CallToolResultSchema>
