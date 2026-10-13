"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { interestAreas, site } from "@/lib/content"
import { contactSchema, type ContactPayload } from "@/lib/contact-schema"

const fieldClass = "h-11"

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const form = useForm<ContactPayload>({
    resolver: zodResolver(contactSchema) as Resolver<ContactPayload>,
    defaultValues: {
      name: "",
      organization: "",
      email: "",
      interest: undefined as unknown as ContactPayload["interest"],
      message: "",
      companyWebsite: "",
    },
  })

  async function onSubmit(values: ContactPayload) {
    setSubmitted(false)
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      if (!response.ok) {
        throw new Error("Request failed")
      }
      form.reset()
      setSubmitted(true)
      toast.success("Briefing request received. We will respond in confidence.")
    } catch {
      toast.error(`We could not send that. Please email ${site.email}.`)
    }
  }

  return (
    <Card className="rounded-2xl border border-border bg-card py-0 shadow-[0_18px_50px_-32px_rgba(14,26,46,0.45)] ring-0 dark:shadow-none">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, () => setSubmitted(false))}
          noValidate
          className="relative grid gap-5 p-6 md:p-8"
        >
          <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
            <label>
              Website
              <input
                tabIndex={-1}
                autoComplete="off"
                {...form.register("companyWebsite")}
              />
            </label>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="name"
                    className={fieldClass}
                    placeholder="Your name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="organization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="organization"
                    className={fieldClass}
                    placeholder="Organization"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    autoComplete="email"
                    className={fieldClass}
                    placeholder="name@organization.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interest"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area of interest</FormLabel>
                <Select
                  name={field.name}
                  value={field.value ?? null}
                  onValueChange={(value) => {
                    if (value) field.onChange(value)
                  }}
                  items={interestAreas.map((area) => ({
                    value: area.value,
                    label: area.label,
                  }))}
                >
                  <FormControl>
                    <SelectTrigger className="h-11 w-full" onBlur={field.onBlur}>
                      <SelectValue placeholder="Select an area" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {interestAreas.map((area) => (
                      <SelectItem key={area.value} value={area.value}>
                        {area.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What do you need to know?</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="min-h-36"
                    placeholder="The decision, the market, or the question."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            variant="signal"
            className="h-11"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Sending" : "Request a briefing"}
          </Button>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {site.confidentiality}
          </p>
          {submitted ? (
            <p role="status" className="text-sm text-foreground">
              Request received. We will be in touch.
            </p>
          ) : null}
        </form>
      </Form>
    </Card>
  )
}
