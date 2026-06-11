// Matches /file/, /design/, or /board/ segments in Figma URLs
const FILE_URL_RE = /figma\.com\/(?:file|design|board)\/([A-Za-z0-9]+)/;

export function parseFileKey(input: string): string {
  const match = FILE_URL_RE.exec(input);
  if (match) return match[1];

  // Treat bare alphanumeric strings as raw file keys
  if (/^[A-Za-z0-9]+$/.test(input)) return input;

  throw new Error(
    `Could not parse a file key from: "${input}"\n` +
      'Pass a Figma URL or a raw file key (e.g. ABC123XYZ).'
  );
}
