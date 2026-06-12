export type JobStatus = "queued" | "downloading" | "converting" | "done" | "error"

export interface Job {
  id: string
  url: string
  format: "mp3" | "mp4"
  quality: string
  status: JobStatus
  percent: number
  speed: string
  eta: string
  title?: string
  thumbnail?: string
  filename?: string
  filesize?: string
  filePath?: string
  error?: string
  createdAt: number
}

const jobs = new Map<string, Job>()

// Auto-cleanup jobs older than 30 minutes
setInterval(() => {
  const now = Date.now()
  for (const [id, job] of jobs.entries()) {
    if (now - job.createdAt > 30 * 60 * 1000) {
      jobs.delete(id)
    }
  }
}, 5 * 60 * 1000)

export const jobQueue = {
  create(id: string, data: Pick<Job, "url" | "format" | "quality">): Job {
    const job: Job = {
      id,
      ...data,
      status: "queued",
      percent: 0,
      speed: "",
      eta: "",
      createdAt: Date.now()
    }
    jobs.set(id, job)
    return job
  },

  update(id: string, patch: Partial<Job>): void {
    const job = jobs.get(id)
    if (job) jobs.set(id, { ...job, ...patch })
  },

  get(id: string): Job | undefined {
    return jobs.get(id)
  },

  delete(id: string): void {
    jobs.delete(id)
  }
}
