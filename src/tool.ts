import type { Tool, ToolParameters } from './types'

export function defineTool<Parameters extends ToolParameters = ToolParameters>(tool: Tool<Parameters>) {
  return tool
}
