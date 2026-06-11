import Table from 'cli-table3';
import { colors } from './colors.js';

export function print(data: unknown, jsonMode = false): void {
  if (jsonMode) {
    process.stdout.write(JSON.stringify(data, null, 2) + '\n');
    return;
  }

  if (Array.isArray(data)) {
    printArray(data);
  } else if (typeof data === 'object' && data !== null) {
    printObject(data as Record<string, unknown>);
  } else {
    console.log(String(data));
  }
}

function printObject(obj: Record<string, unknown>): void {
  const table = new Table();
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined) {
      table.push({ [colors.key(key)]: String(value) });
    }
  }
  console.log(table.toString());
}

function printArray(arr: unknown[]): void {
  if (arr.length === 0) {
    console.log(colors.dim('No results'));
    return;
  }

  if (typeof arr[0] === 'object' && arr[0] !== null) {
    const headers = Object.keys(arr[0] as Record<string, unknown>);
    const table = new Table({ head: headers.map((h) => colors.key(h)) });
    for (const item of arr) {
      const row = headers.map((h) =>
        String((item as Record<string, unknown>)[h] ?? '')
      );
      table.push(row);
    }
    console.log(table.toString());
  } else {
    for (const item of arr) console.log(String(item));
  }
}

export function printSuccess(message: string, jsonMode = false): void {
  if (jsonMode) {
    process.stdout.write(JSON.stringify({ success: true, message }) + '\n');
    return;
  }
  console.log(colors.success('✓') + ' ' + message);
}

export function printError(message: string, jsonMode = false): void {
  if (jsonMode) {
    process.stdout.write(JSON.stringify({ error: message }) + '\n');
    return;
  }
  console.error(colors.error('✗') + ' ' + message);
}
