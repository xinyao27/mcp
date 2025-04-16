import type { Tool, ToolParameters } from './types'

export function defineTool<P extends ToolParameters>(tool: Tool<P>) {
  return tool
}
