import { z } from "zod"

import { interestAreas } from "@/lib/content"

const interestValues = interestAreas.map((area) => area.value) as [
  (typeof interestAreas)[number]["value"],
  ...(typeof interestAreas)[number]["value"][],
]

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(120),
  organization: z
    .string()
    .trim()
    .min(2, "Enter your organization.")
    .max(160),
  email: z
    .string()
    .trim()
    .min(1, "Enter your email.")
    .pipe(z.email("Enter a valid email address.")),
  interest: z.enum(interestValues, { error: "Select an area of interest." }),
  message: z
    .string()
    .trim()
    .min(12, "Tell us a little more about what you need to know.")
    .max(4000),
  companyWebsite: z.string().optional().default(""),
})

export type ContactPayload = z.infer<typeof contactSchema>
