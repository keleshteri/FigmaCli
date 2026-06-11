import { Command } from 'commander';
import { createApiClient, extractApiError } from '../../api/client.js';
import { getFileInfo } from '../../api/files.js';
import { getTokenAsync } from '../../auth/token.js';
import { parseFileKey } from '../../utils/file-key.js';
import { createSpinner } from '../../output/spinner.js';
import { print, printError } from '../../output/printer.js';

export function infoCommand(): Command {
  return new Command('info')
    .description('Show metadata for a Figma file')
    .argument('<file-key>', 'File key or Figma URL')
    .action(async (input: string, _opts: unknown, cmd: Command) => {
      const globalOpts = cmd.optsWithGlobals<{ json: boolean; token?: string }>();
      const token = globalOpts.token ?? (await getTokenAsync());

      if (!token) {
        printError(
          'Not authenticated. Run `figma auth login --token <pat>` or set FIGMA_TOKEN.',
          globalOpts.json
        );
        process.exit(1);
      }

      let fileKey: string;
      try {
        fileKey = parseFileKey(input);
      } catch (err) {
        printError((err as Error).message, globalOpts.json);
        process.exit(1);
      }

      const spinner = createSpinner('Fetching file info…');
      if (!globalOpts.json) spinner.start();

      try {
        const client = createApiClient(token);
        const file = await getFileInfo(client, fileKey);
        if (!globalOpts.json) spinner.stop();
        print(
          {
            name: file.name,
            lastModified: file.lastModified,
            version: file.version,
            role: file.role,
            editorType: file.editorType,
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
