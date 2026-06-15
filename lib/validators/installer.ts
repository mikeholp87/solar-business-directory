import { z } from "zod";

export const installerSchema = z.object({
  id: z.string(),
  companyName: z.string(),
  slug: z.string(),
  logoUrl: z.string(),
  coverImageUrl: z.string(),
  territoryIds: z.array(z.string()),
  services: z.array(z.string()),
  description: z.string(),
  areasCovered: z.array(z.string()),
  monthlyInstallCapacity: z.number(),
  surveyTurnaroundDays: z.number(),
  warranty: z.string(),
  rating: z.number(),
  status: z.enum(["pending", "approved", "active", "suspended", "cancelled"]),
  subscriptionStatus: z.enum(["trialing", "active", "past_due", "offline_active", "cancelled"]),
  leadPrice: z.number().optional(),
  gallery: z.array(z.string())
});
