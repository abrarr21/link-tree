import { z } from "zod";

export const createLinkSchema = z.object({
  body: z.object({
    link: z.string().url("Must be a valid URL string with http:// or https://"),
    title: z.string().min(1, "Title is required"),
  }),
});
