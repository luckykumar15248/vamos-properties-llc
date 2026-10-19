import { z } from "zod";
import { leadSituations, paths } from "@/lib/site";

const situationValues = leadSituations.map((item) => item.value) as [
  (typeof leadSituations)[number]["value"],
  ...(typeof leadSituations)[number]["value"][],
];

const pathValues = paths.map((item) => item.value) as [
  (typeof paths)[number]["value"],
  ...(typeof paths)[number]["value"][],
];

export const leadSchema = z.object({
  address: z.string().trim().min(5, "Enter the property address."),
  name: z.string().trim().min(2, "Enter your name."),
  phone: z
    .string()
    .trim()
    .transform((value) => value.replace(/\D/g, ""))
    .refine((value) => value.length === 10 || value.length === 11, "Enter a 10-digit mobile number."),
  email: z.string().trim().min(1, "Enter your email.").email("That email does not look right."),
  message: z
    .string()
    .trim()
    .min(5, "Tell us a little about the situation.")
    .max(2000, "Keep the note under 2,000 characters."),
  situation: z.enum(situationValues),
  trusteeSaleDate: z
    .string()
    .trim()
    .refine((value) => value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value), "Use a real sale date.")
    .optional(),
  preferredPath: z.enum(pathValues),
  language: z.enum(["en", "es"]),
  sourcePath: z.string().trim().min(1).max(200),
  utmSource: z.string().trim().max(120).optional(),
  utmMedium: z.string().trim().max(120).optional(),
  utmCampaign: z.string().trim().max(120).optional(),
  consent: z.literal("yes", { errorMap: () => ({ message: "Consent is required before we can call or text." }) }),
  company: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
