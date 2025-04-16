import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import path from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

let client: Client

beforeAll(async () => {
  const transport = new StdioClientTransport({
    args: ['run', path.join(process.cwd(), 'src/index.ts')],
    command: 'bun',
  })
  client = new Client({
    name: 'test',
    version: '1.0.0',
  })
  await client.connect(transport)
})

afterAll(async () => {
  await client.close()
})

describe('cat', () => {
  it('should be able to call cat', async () => {
    const result = await client.callTool({
      arguments: {
        numberOfCats: 1,
      },
      name: 'cat',
    })
    expect(result).toBeDefined()
  })
})
