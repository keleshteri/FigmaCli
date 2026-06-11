import type { Got } from 'got';

export interface FigmaFile {
  name: string;
  lastModified: string;
  thumbnailUrl: string;
  version: string;
  role: string;
  editorType: string;
  linkAccess: string;
}

export async function getFileInfo(client: Got, fileKey: string): Promise<FigmaFile> {
  return client
    .get(`v1/files/${fileKey}`, { searchParams: { depth: 1 } })
    .json<FigmaFile>();
}
