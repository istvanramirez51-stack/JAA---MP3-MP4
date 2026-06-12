import { Router, Request, Response } from "express"
import { nanoid } from "nanoid"
import { jobQueue } from "../services/jobQueue"
import { runDownload } from "../services/ytdlp"
import { validateUrl } from "../middleware/validateUrl"
import { downloadLimiter } from "../middleware/rateLimiter"

export const downloadRouter = Router()

downloadRouter.post("/", downloadLimiter, validateUrl, (req: Request, res: Response) => {
  const { url, format, quality } = req.body as {
    url: string
    format: "mp3" | "mp4"
    quality: string
  }

  if (!format || !["mp3", "mp4"].includes(format)) {
    res.status(400).json({ error: "Invalid format. Must be mp3 or mp4.", code: "INVALID_FORMAT" })
    return
  }

  const validQualities: Record<string, string[]> = {
    mp3: ["128", "320"],
    mp4: ["720", "1080"],
  }

  if (!quality || !validQualities[format].includes(quality)) {
    res.status(400).json({
      error: `Invalid quality for ${format}. Valid: ${validQualities[format].join(", ")}`,
      code: "INVALID_QUALITY"
    })
    return
  }

  const jobId = nanoid(12)
  jobQueue.create(jobId, { url, format, quality })

  // Fire download in background (non-blocking)
  setImmediate(() => runDownload(jobId))

  res.json({ jobId })
})
