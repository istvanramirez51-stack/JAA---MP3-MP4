import { Request, Response, NextFunction } from "express"

const ALLOWED_DOMAINS = [
  "youtube.com",
  "youtu.be",
  "www.youtube.com",
  "m.youtube.com",
  "instagram.com",
  "www.instagram.com",
  "tiktok.com",
  "www.tiktok.com",
  "vm.tiktok.com",
  "twitter.com",
  "x.com",
  "www.twitter.com",
  "www.x.com",
  "facebook.com",
  "www.facebook.com",
  "fb.watch",
  "soundcloud.com",
  "www.soundcloud.com",
  "vimeo.com",
  "www.vimeo.com",
]

export function validateUrl(req: Request, res: Response, next: NextFunction): void {
  const url = (req.body?.url || req.query?.url) as string | undefined

  if (!url) {
    res.status(400).json({ error: "URL is required.", code: "MISSING_URL" })
    return
  }

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    res.status(400).json({ error: "Invalid URL format.", code: "INVALID_URL" })
    return
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    res.status(400).json({ error: "Only HTTP/HTTPS URLs are allowed.", code: "INVALID_PROTOCOL" })
    return
  }

  const hostname = parsed.hostname.toLowerCase()
  const isAllowed = ALLOWED_DOMAINS.some(d => hostname === d || hostname.endsWith(`.${d}`))

  if (!isAllowed) {
    res.status(400).json({
      error: `Platform not supported. Supported: YouTube, Instagram, TikTok, Twitter/X, Facebook, SoundCloud, Vimeo.`,
      code: "UNSUPPORTED_PLATFORM"
    })
    return
  }

  next()
}
