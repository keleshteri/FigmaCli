import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { configSchema, type Config } from './schema.js';

const CONFIG_FILES = ['.figmarc', 'figma.config.json'];

/** Walks up from cwd looking for .figmarc / figma.config.json. Returns {} if none found. */
export function loadConfig(): Config {
  let dir = process.cwd();

  while (true) {
    for (const filename of CONFIG_FILES) {
      const filepath = join(dir, filename);
      if (existsSync(filepath)) {
        try {
          const raw = JSON.parse(readFileSync(filepath, 'utf-8'));
          return configSchema.parse(raw);
        } catch {
          return {};
        }
      }
    }

    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  return {};
}
