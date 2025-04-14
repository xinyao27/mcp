import { FastMCP } from 'fastmcp'

import { tools } from './tools'

export const server = new FastMCP({
  name: 'XYStack MCP Server',
  version: '0.0.1',
})

for (const tool of tools) {
  server.addTool(tool)
}

server.start({
  sse: {
    endpoint: '/sse',
    port: 3001,
  },
  transportType: 'sse',
})
