import type { Tool } from '../types'

import { catTool } from './cat'
import { timeTool } from './time'

export const tools: Tool<any>[] = [catTool, timeTool]
