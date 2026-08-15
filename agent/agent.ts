import { defineAgent } from 'eve/sdk';

export default defineAgent({
  name: 'DIGECOG Assistant',
  description: 'An AI agent to assist with accounting and financial management at DIGECOG',
  model: 'gpt-4',
});
