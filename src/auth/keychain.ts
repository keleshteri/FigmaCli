interface Keytar {
  getPassword(service: string, account: string): Promise<string | null>;
  setPassword(service: string, account: string, password: string): Promise<void>;
  deletePassword(service: string, account: string): Promise<boolean>;
}

// undefined = not tried yet; null = unavailable on this system
let _keytar: Keytar | null | undefined;

async function loadKeytar(): Promise<Keytar | null> {
  if (_keytar !== undefined) return _keytar;
  try {
    const mod = await import('keytar');
    _keytar = (mod.default ?? mod) as Keytar;
  } catch {
    _keytar = null;
  }
  return _keytar;
}

export async function getPassword(service: string, account: string): Promise<string | null> {
  const kt = await loadKeytar();
  return kt?.getPassword(service, account) ?? null;
}

export async function setPassword(
  service: string,
  account: string,
  password: string
): Promise<void> {
  const kt = await loadKeytar();
  if (!kt) {
    throw new Error(
      'OS keychain is unavailable on this system. Use the FIGMA_TOKEN environment variable instead.'
    );
  }
  await kt.setPassword(service, account, password);
}

export async function deletePassword(service: string, account: string): Promise<void> {
  const kt = await loadKeytar();
  await kt?.deletePassword(service, account);
}
