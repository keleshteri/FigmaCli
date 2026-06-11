#!/usr/bin/env node
import { Command } from 'commander';
import { registerAuthCommands } from './commands/auth/index.js';
import { registerFileCommands } from './commands/file/index.js';

process.on('unhandledRejection', (reason) => {
  console.error('Unexpected error:', reason);
  process.exit(1);
});

const program = new Command();

program
  .name('figma')
  .description('Full-featured CLI for the Figma REST API')
  .version('0.1.0')
  .option('--json', 'Output raw JSON (machine-readable, no decorations)')
  .option('--token <token>', 'Figma personal access token (overrides stored auth)');

registerAuthCommands(program);
registerFileCommands(program);

await program.parseAsync(process.argv);
