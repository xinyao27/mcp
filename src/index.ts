import { MCP } from './server'
import { tools } from './tools'

const server = new MCP({
  name: 'mcp-server',
  tools,
  transport: 'stdio',
  version: '0.0.0',
})

await server.start()
