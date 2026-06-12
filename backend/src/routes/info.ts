import { Router, Request, Response } from "express"
import { spawn } from "child_process"
import { validateUrl } from "../middleware/validateUrl"
import { infoLimiter } from "../middleware/rateLimiter"

export const infoRouter = Router()

const YTDLP = process.env.YTDLP_BINARY_PATH || "yt-dlp"

infoRouter.get("/", infoLimiter, validateUrl, (req: Request, res: Response) => {
  const url = req.query.url as string

  const args = [
    url,
    "--dump-json",
    "--no-playlist",
    "--no-warnings",
    "--skip-download",
  ]

  let output = ""
  let errOutput = ""
  let responded = false

  const reply = (fn: () => void) => {
    if (responded) return
    responded = true
    fn()
  }

  const proc = spawn(YTDLP, args)

  proc.stdout.on("data", (chunk: Buffer) => { output += chunk.toString() })
  proc.stderr.on("data", (chunk: Buffer) => { errOutput += chunk.toString() })

  proc.on("close", (code) => {
    if (code !== 0 || !output.trim()) {
      const msg = errOutput.includes("Private video")
        ? "This video is private."
        : errOutput.includes("not available")
        ? "This video is not available."
        : "Could not fetch video info. The URL may be invalid or unsupported."
      reply(() => res.status(422).json({ error: msg, code: "INFO_FAILED" }))
      return
    }

    try {
      const data = JSON.parse(output.trim())
      reply(() => res.json({
        title: data.title || "Unknown Title",
        thumbnail: data.thumbnail || null,
        duration: data.duration || 0,
        uploader: data.uploader || data.channel || "",
        platform: data.extractor_key || "",
        formats: {
          mp3: ["128kbps", "320kbps"],
          mp4: ["720p", "1080p"].filter(q => {
            if (q === "1080p") return data.formats?.some((f: { height?: number }) => f.height && f.height >= 1080)
            return true
          })
        }
      }))
    } catch {
      reply(() => res.status(500).json({ error: "Failed to parse video metadata.", code: "PARSE_ERROR" }))
    }
  })

  proc.on("error", (err) => {
    const isNotFound = (err as NodeJS.ErrnoException).code === "ENOENT"
    reply(() => res.status(500).json({
      error: isNotFound
        ? "yt-dlp not found. Install yt-dlp and make sure it's in PATH."
        : "Failed to spawn yt-dlp process.",
      code: "YTDLP_MISSING"
    }))
  })
})