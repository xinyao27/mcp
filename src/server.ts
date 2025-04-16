import { Server as MCPServer } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError } from '@modelcontextprotocol/sdk/types.js'
import consola from 'consola'
import zodToJsonSchema from 'zod-to-json-schema'

import type { Server, ToolResult } from './types'

import { errorContent } from './utils'

export class MCP {
  #mcpServer: MCPServer
  #tools: Server['tools']
  #transport: Server['transport']

  constructor(server: Server) {
    this.#mcpServer = new MCPServer(
      {
        name: server.name,
        version: server.version,
      },
      {
        capabilities: {
          tools: {},
        },
      },
    )
    this.#tools = server.tools
    this.#transport = server.transport

    this.setupTools()
  }

  setupTools() {
    this.#mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: await Promise.all(
          this.#tools.map(async (tool) => {
            return {
              description: tool.description,
              inputSchema: tool.parameters ? await zodToJsonSchema(tool.parameters) : undefined,
              name: tool.name,
            }
          }),
        ),
      }
    })

    this.#mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
      const tool = this.#tools.find((tool) => tool.name === request.params.name)

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
  }

  async start() {
    if (this.#transport === 'stdio') {
      const transport = new StdioServerTransport()
      await this.#mcpServer.connect(transport)
      consola.success(`server is running on stdio`)
    } else {
      throw new Error(`Unsupported transport: ${this.#transport}`)
    }
  }
}
