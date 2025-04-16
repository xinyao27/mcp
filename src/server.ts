import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError } from '@modelcontextprotocol/sdk/types.js'
import { zodToJsonSchema } from 'zod-to-json-schema'

import type { ToolResult } from './types'

import { tools } from './tools'
import { errorContent } from './utils'

export const server = new Server(
  {
    name: 'XYStack MCP Server',
    version: '0.0.1',
  },
  {
    capabilities: {
      tools: {},
    },
  },
)

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: await Promise.all(
      tools.map(async (tool) => {
        return {
          description: tool.description,
          inputSchema: tool.parameters ? await zodToJsonSchema(tool.parameters) : undefined,
          name: tool.name,
        }
      }),
    ),
  }
})

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = tools.find((tool) => tool.name === request.params.name)

  if (!tool) {
    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`)
  }

  let args: any

  if (tool.parameters) {
    const parsed = await tool.parameters['~standard'].validate(request.params.arguments)

    if (parsed.issues) {
      throw new McpError(ErrorCode.InvalidParams, `Invalid ${request.params.name} parameters`)
    }

    args = parsed.value
  }

  let result: ToolResult

  try {
    result = await tool.execute(args)
  } catch (error) {
    return errorContent(`Error: ${error}`)
  }

  return result
})

const transport = new StdioServerTransport()
await server.connect(transport)
