import { Command } from 'commander';
import { deleteToken } from '../../auth/token.js';
import { createSpinner } from '../../output/spinner.js';
import { printSuccess, printError } from '../../output/printer.js';

export function logoutCommand(): Command {
  return new Command('logout')
    .description('Remove stored Figma credentials')
    .action(async (_opts: unknown, cmd: Command) => {
      const globalOpts = cmd.optsWithGlobals<{ json: boolean }>();

      const spinner = createSpinner('Removing credentials…');
      if (!globalOpts.json) spinner.start();

      try {
        await deleteToken();
        if (!globalOpts.json) {
          spinner.succeed('Logged out.');
        } else {
          printSuccess('Logged out.', true);
        }
      } catch (err) {
        if (!globalOpts.json) spinner.fail('Failed to remove credentials');
        printError((err as Error).message, globalOpts.json);
        process.exit(1);
      }
    });
}
