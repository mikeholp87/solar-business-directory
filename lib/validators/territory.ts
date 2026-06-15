import { z } from "zod";

export const territorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string().optional(),
  region: z.string(),
  counties: z.array(z.string()),
  postcodePrefixes: z.array(z.string()),
  maxInstallerSlots: z.number(),
  status: z.enum(["available", "limited", "full", "priority"]),
  priority: z.boolean().optional(),
  leadVolume: z.number(),
  activeInstallerCount: z.number(),
  notes: z.string().optional()
});
