import { defineTool } from 'eve/tools';
import { z } from 'zod';

export const getAccountingHelp = defineTool({
  name: 'get_accounting_help',
  description: 'Get help with accounting concepts and DIGECOG procedures',
  inputSchema: z.object({
    topic: z.string().describe('The accounting or financial topic to get help with'),
    context: z.string().optional().describe('Additional context about your query'),
  }),
  execute: async ({ topic, context }) => {
    // This is a placeholder implementation
    // In production, this would connect to documentation or AI services
    return {
      topic,
      context,
      message: `Information about ${topic} would be provided here. ${context ? `Context: ${context}` : ''}`,
      documentationLink: 'https://orisonsoto.github.io/digecog-library/',
    };
  },
});
