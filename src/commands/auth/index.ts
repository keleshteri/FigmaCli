import { Command } from 'commander';
import { loginCommand } from './login.js';
import { logoutCommand } from './logout.js';
import { whoamiCommand } from './whoami.js';

export function registerAuthCommands(program: Command): void {
  const auth = program.command('auth').description('Manage Figma authentication');
  auth.addCommand(loginCommand());
  auth.addCommand(logoutCommand());
  auth.addCommand(whoamiCommand());
}
