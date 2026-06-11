import type { Got } from 'got';

export interface FigmaUser {
  id: string;
  email: string;
  handle: string;
  img_url: string;
}

export async function getMe(client: Got): Promise<FigmaUser> {
  return client.get('v1/me').json<FigmaUser>();
}
