import { spawn } from "child_process"
import path from "path"
import fs from "fs"
import { jobQueue } from "./jobQueue"

const YTDLP = process.env.YTDLP_BINARY_PATH || "yt-dlp"
const TMP_DIR = process.env.TMP_DIR || "/tmp/rawload"

// Ensure tmp dir exists
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true })
}

const PROGRESS_RE = /\[download\]\s+([\d.]+)%\s+of\s+~?\s*([\d.]+\s*\w+)\s+at\s+([\d.]+\s*\w+\/s)(?:\s+ETA\s+([\d:]+))?/
const DEST_RE = /\[(?:ExtractAudio|Merger|ffmpeg)\]\s+Destination:\s+(.+)/
const ALREADY_RE = /\[download\]\s+(.+)\s+has already been downloaded/

function formatBytes(str: string): string {
  return str.trim()
}

export function runDownload(jobId: string): void {
  const job = jobQueue.get(jobId)
  if (!job) return

  const outputTemplate = path.join(TMP_DIR, `${jobId}_%(title)s.%(ext)s`)

  let args: string[]

  if (job.format === "mp3") {
    args = [
      job.url,
      "-x",
      "--audio-format", "mp3",
      "--audio-quality", job.quality === "320" ? "0" : "5",
      "--output", outputTemplate,
      "--no-playlist",
      "--no-warnings",
      "--progress",
      "--newline",
    ]
  } else {
    const height = job.quality === "1080" ? "1080" : "720"
    args = [
      job.url,
      "-f", `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]`,
      "--merge-output-format", "mp4",
      "--output", outputTemplate,
      "--no-playlist",
      "--no-warnings",
      "--progress",
      "--newline",
    ]
  }

  jobQueue.update(jobId, { status: "downloading" })

  const proc = spawn(YTDLP, args, { stdio: ["ignore", "pipe", "pipe"] })
  let finalPath = ""

  proc.stdout.on("data", (chunk: Buffer) => {
    const lines = chunk.toString().split("\n")
    for (const line of lines) {
      const progressMatch = PROGRESS_RE.exec(line)
      if (progressMatch) {
        const percent = parseFloat(progressMatch[1])
        const filesize = formatBytes(progressMatch[2])
        const speed = formatBytes(progressMatch[3])
        const eta = progressMatch[4] || ""
        jobQueue.update(jobId, { percent, filesize, speed, eta, status: "downloading" })
        continue
      }

      // Detect conversion phase
      if (line.includes("[ExtractAudio]") || line.includes("[Merger]") || line.includes("[ffmpeg]")) {
        jobQueue.update(jobId, { status: "converting", percent: 99 })
      }

      const destMatch = DEST_RE.exec(line)
      if (destMatch) finalPath = destMatch[1].trim()

      const alreadyMatch = ALREADY_RE.exec(line)
      if (alreadyMatch) finalPath = alreadyMatch[1].trim()
    }
  })

  proc.stderr.on("data", (chunk: Buffer) => {
    const text = chunk.toString()
    // Only log real errors, not warnings
    if (text.includes("ERROR")) {
      console.error(`[yt-dlp][${jobId}] ${text.trim()}`)
    }
  })

  proc.on("close", (code) => {
    if (code !== 0) {
      jobQueue.update(jobId, {
        status: "error",
        error: "Download failed. The video may be private, geo-restricted, or the URL is unsupported."
      })
      return
    }

    // If finalPath wasn't captured from stderr, find the file by jobId prefix
    if (!finalPath || !fs.existsSync(finalPath)) {
      const files = fs.readdirSync(TMP_DIR).filter(f => f.startsWith(jobId))
      if (files.length > 0) {
        finalPath = path.join(TMP_DIR, files[0])
      }
    }

    if (!finalPath || !fs.existsSync(finalPath)) {
      jobQueue.update(jobId, { status: "error", error: "Output file not found after download." })
      return
    }

    const stat = fs.statSync(finalPath)
    const fileSizeMB = (stat.size / (1024 * 1024)).toFixed(1) + " MB"
    const filename = path.basename(finalPath)

    jobQueue.update(jobId, {
      status: "done",
      percent: 100,
      speed: "",
      eta: "",
      filePath: finalPath,
      filename,
      filesize: fileSizeMB,
    })
  })

  proc.on("error", (err) => {
    jobQueue.update(jobId, {
      status: "error",
      error: `Failed to start yt-dlp: ${err.message}. Make sure yt-dlp is installed.`
    })
  })
}
