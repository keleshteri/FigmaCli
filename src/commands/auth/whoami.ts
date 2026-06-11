import { Command } from 'commander';
import { createApiClient, extractApiError } from '../../api/client.js';
import { getMe } from '../../api/users.js';
import { getTokenAsync } from '../../auth/token.js';
import { createSpinner } from '../../output/spinner.js';
import { print, printError } from '../../output/printer.js';

export function whoamiCommand(): Command {
  return new Command('whoami')
    .description('Show the currently authenticated Figma user')
    .action(async (_opts: unknown, cmd: Command) => {
      const globalOpts = cmd.optsWithGlobals<{ json: boolean; token?: string }>();
      const token = globalOpts.token ?? (await getTokenAsync());

      if (!token) {
        printError(
          'Not authenticated. Run `figma auth login --token <pat>` or set FIGMA_TOKEN.',
          globalOpts.json
        );
        process.exit(1);
      }

      const spinner = createSpinner('Fetching user…');
      if (!globalOpts.json) spinner.start();

      try {
        const client = createApiClient(token);
        const user = await getMe(client);
        if (!globalOpts.json) spinner.stop();
        print(
          {
            handle: user.handle,
            email: user.email,
            id: user.id,
          },
          globalOpts.json
        );
      } catch (err) {
        if (!globalOpts.json) spinner.fail('Request failed');
        printError(extractApiError(err), globalOpts.json);
        process.exit(1);
      }
    });
}
