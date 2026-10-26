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

  try {
    const { getPayload } = await import("payload")
    const config = (await import("@payload-config")).default
    const payload = await getPayload({ config })
    await payload.create({
      collection: "inquiries",
      data: {
        name: enquiry.name,
        email: enquiry.email,
        organization: enquiry.organization,
        interest: enquiry.interest,
        message: enquiry.message,
        status: "new",
      },
      overrideAccess: true,
    })
  } catch (err) {
    console.error("Failed to save inquiry to Payload:", err)
  }

  console.info("briefing request", enquiry)

  return Response.json({ ok: true })
}
