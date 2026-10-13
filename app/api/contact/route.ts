import { contactSchema } from "@/lib/contact-schema"

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false, message: "Invalid request." }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { ok: false, fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  if (parsed.data.companyWebsite) {
    return Response.json({ ok: true })
  }

  const { companyWebsite, ...enquiry } = parsed.data
  void companyWebsite
  // TODO: send this enquiry through Resend (or a similar transactional email service)
  // to info@dataqraft.io. Logging is a stand-in until that is configured.
  console.info("briefing request", enquiry)

  return Response.json({ ok: true })
}
