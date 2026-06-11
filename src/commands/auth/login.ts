import { Command } from 'commander';
import { setToken } from '../../auth/token.js';
import { createSpinner } from '../../output/spinner.js';
import { printSuccess, printError } from '../../output/printer.js';

export function loginCommand(): Command {
  return new Command('login')
    .description('Store a Figma personal access token (PAT)')
    .option('--token <pat>', 'Personal access token to store')
    .action(async (opts: { token?: string }, cmd: Command) => {
      const globalOpts = cmd.optsWithGlobals<{ json: boolean; token?: string }>();
      const token = opts.token ?? process.env['FIGMA_TOKEN'];

      if (!token) {
        printError(
          'No token provided. Use --token <pat> or set the FIGMA_TOKEN environment variable.',
          globalOpts.json
        );
        process.exit(1);
      }

      const spinner = createSpinner('Storing credentials in OS keychain…');
      if (!globalOpts.json) spinner.start();

      try {
        await setToken(token);
        if (!globalOpts.json) {
          spinner.succeed('Logged in. Run `figma auth whoami` to verify.');
        } else {
          printSuccess('Logged in.', true);
        }
      } catch (err) {
        if (!globalOpts.json) spinner.fail('Failed to store credentials');
        printError((err as Error).message, globalOpts.json);
        process.exit(1);
      }
    });
}
