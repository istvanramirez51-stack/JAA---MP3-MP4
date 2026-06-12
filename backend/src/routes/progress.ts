import { Router, Request, Response } from "express"
import { jobQueue } from "../services/jobQueue"

export const progressRouter = Router()

progressRouter.get("/:jobId", (req: Request, res: Response) => {
  const { jobId } = req.params

  const job = jobQueue.get(jobId)
  if (!job) {
    res.status(404).json({ error: "Job not found.", code: "JOB_NOT_FOUND" })
    return
  }

  res.setHeader("Content-Type", "text/event-stream")
  res.setHeader("Cache-Control", "no-cache")
  res.setHeader("Connection", "keep-alive")
  res.setHeader("X-Accel-Buffering", "no") // needed for Railway/nginx
  res.flushHeaders()

  const send = (event: string, data: object) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
  }

  const interval = setInterval(() => {
    const current = jobQueue.get(jobId)

    if (!current) {
      send("error", { message: "Job not found.", code: "JOB_NOT_FOUND" })
      clearInterval(interval)
      res.end()
      return
    }

    send("progress", {
      status: current.status,
      percent: current.percent,
      speed: current.speed,
      eta: current.eta,
      filename: current.filename,
      filesize: current.filesize,
      title: current.title,
      thumbnail: current.thumbnail,
      error: current.error,
    })

    if (current.status === "done" || current.status === "error") {
      clearInterval(interval)
      setTimeout(() => res.end(), 200)
    }
  }, 400)

  // Clean up on client disconnect
  req.on("close", () => {
    clearInterval(interval)
  })
})
