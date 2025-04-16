import { defineTool } from '../../tool'
import { textContent } from '../../utils'
import { timeToolParametersSchema } from './schema'

const DEFAULT_TIMEZONE = 'America/New_York'

export const timeTool = defineTool({
  description: 'Get the current time',
  execute: async ({ timezone = DEFAULT_TIMEZONE }) => {
    const time = new Date().toLocaleString('en-US', { timeZone: timezone })

    return {
      content: [textContent(time)],
    }
  },
  name: 'time',
  parameters: timeToolParametersSchema,
})
