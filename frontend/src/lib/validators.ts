import { z } from "zod"

const SUPPORTED_DOMAINS = [
  "youtube.com",
  "youtu.be",
  "instagram.com",
  "tiktok.com",
  "vm.tiktok.com",
  "twitter.com",
  "x.com",
  "facebook.com",
  "fb.watch",
  "soundcloud.com",
  "vimeo.com",
]

export const urlSchema = z.object({
  url: z
    .string()
    .min(1, "URL is required")
    .refine((val) => {
      try {
        const u = new URL(val)
        return ["http:", "https:"].includes(u.protocol)
      } catch {
        return false
      }
    }, "Please enter a valid URL")
    .refine((val) => {
      try {
        const hostname = new URL(val).hostname.toLowerCase().replace(/^www\./, "")
        return SUPPORTED_DOMAINS.some((d) => hostname === d || hostname.endsWith(`.${d}`))
      } catch {
        return false
      }
    }, "Platform not supported. Try YouTube, Instagram, TikTok, or Twitter/X"),
})

export type UrlFormValues = z.infer<typeof urlSchema>
