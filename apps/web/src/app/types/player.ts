import { roleSchema } from "./role";
import { z } from "zod";
export const playerSchema = z.object({
  name: z.string(),
  role: roleSchema.nullable(),
  fixed: z.boolean(),
  position: z.number(),
  selectedTrumpValue: z.number().nullable(),
  color: z.string(),
  usedSkip: z.boolean(),
});

export const playerInputSchema = z.object({
  name: z.string(),
});
export type PlayerInput = z.infer<typeof playerInputSchema>;

export type Player = z.infer<typeof playerSchema>;
