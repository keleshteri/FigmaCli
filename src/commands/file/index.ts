import { Command } from 'commander';
import { infoCommand } from './info.js';

export function registerFileCommands(program: Command): void {
  const file = program.command('file').description('Work with Figma files');
  file.addCommand(infoCommand());
}
