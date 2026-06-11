import { getPassword, setPassword, deletePassword } from './keychain.js';

const SERVICE = 'figma-cli';
const ACCOUNT = 'personal-access-token';

/** Checks env var only — safe to call synchronously early in startup. */
export function getTokenSync(): string | null {
  return process.env['FIGMA_TOKEN'] ?? null;
}

/** Full resolution: env var → OS keychain. */
export async function getTokenAsync(): Promise<string | null> {
  const envToken = process.env['FIGMA_TOKEN'];
  if (envToken) return envToken;
  return getPassword(SERVICE, ACCOUNT);
}

export async function setToken(token: string): Promise<void> {
  await setPassword(SERVICE, ACCOUNT, token);
}

export async function deleteToken(): Promise<void> {
  await deletePassword(SERVICE, ACCOUNT);
}
