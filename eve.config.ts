import { defineConfig } from 'eve/config';

export default defineConfig({
  // Project name
  name: 'digecog',

  // Agent configuration
  agent: {
    // Name of the agent
    name: 'DIGECOG Assistant',
    // Description of the agent
    description: 'An AI agent to assist with accounting and financial management at DIGECOG',
    // Default model to use
    model: 'gpt-4',
  },

  // Optional: Web chat configuration if you want to add a web interface
  // channels: {
  //   web: {
  //     enabled: true,
  //     framework: 'next.js',
  //   },
  // },
});
