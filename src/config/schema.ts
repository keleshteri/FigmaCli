import { z } from 'zod';

export const configSchema = z.object({
  token: z.string().optional(),
  defaultTeamId: z.string().optional(),
  defaultProjectId: z.string().optional(),
  defaultFileKey: z.string().optional(),
});

export type Config = z.infer<typeof configSchema>;
