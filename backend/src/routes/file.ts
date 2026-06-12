import { Router, Request, Response } from "express"
import fs from "fs"
import path from "path"
import { jobQueue } from "../services/jobQueue"

export const fileRouter = Router()

fileRouter.get("/:jobId", (req: Request, res: Response) => {
  const { jobId } = req.params
  const job = jobQueue.get(jobId)

  if (!job) {
    res.status(404).json({ error: "Job not found.", code: "JOB_NOT_FOUND" })
    return
  }

  if (job.status !== "done" || !job.filePath) {
    res.status(400).json({ error: "File not ready yet.", code: "NOT_READY" })
    return
  }

  if (!fs.existsSync(job.filePath)) {
    res.status(410).json({ error: "File has expired or been deleted.", code: "FILE_GONE" })
    return
  }

  const filename = path.basename(job.filePath)
  const contentType = job.format === "mp3" ? "audio/mpeg" : "video/mp4"

  res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(filename)}"`)
  res.setHeader("Content-Type", contentType)

  const stream = fs.createReadStream(job.filePath)
  stream.pipe(res)

  stream.on("close", () => {
    // Delete file after delivery
    fs.unlink(job.filePath!, () => {})
    jobQueue.delete(jobId)
  })

  stream.on("error", () => {
    res.status(500).end()
  })
})
