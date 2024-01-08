import { z } from "zod";

export const roleSchema = z.object({
  name: z.union([
    z.literal("ファシリ"),
    z.literal("書記"),
    z.literal("1番目"),
    z.literal("2番目"),
    z.literal("スキップ"),
  ]),
  fixed: z.boolean(),
});

export type Role = z.infer<typeof roleSchema>;
export type RoleType = z.infer<typeof roleSchema>["name"];
