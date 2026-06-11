import got, { type Got, type HTTPError } from 'got';

export function createApiClient(token: string): Got {
  return got.extend({
    prefixUrl: 'https://api.figma.com',
    headers: {
      'X-Figma-Token': token,
    },
    retry: {
      limit: 3,
      statusCodes: [429, 500, 502, 503, 504],
    },
  });
}

export function extractApiError(err: unknown): string {
  const httpErr = err as HTTPError;
  if (httpErr?.response) {
    const body = httpErr.response.body as Record<string, unknown> | undefined;
    if (typeof body?.err === 'string') return body.err;
    if (typeof body?.message === 'string') return body.message;
    return `HTTP ${httpErr.response.statusCode}`;
  }
  return (err as Error).message ?? String(err);
}
