import axios from "axios"

export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001"

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15_000,
})

export interface VideoInfo {
  title: string
  thumbnail: string | null
  duration: number
  uploader: string
  platform: string
  formats: {
    mp3: string[]
    mp4: string[]
  }
}

export interface DownloadPayload {
  url: string
  format: "mp3" | "mp4"
  quality: string
}

export interface ProgressEvent {
  status: "queued" | "downloading" | "converting" | "done" | "error"
  percent: number
  speed: string
  eta: string
  filename?: string
  filesize?: string
  title?: string
  thumbnail?: string
  error?: string
}

export const getInfo = (url: string) =>
  api.get<VideoInfo>(`/api/info?url=${encodeURIComponent(url)}`)

export const startJob = (payload: DownloadPayload) =>
  api.post<{ jobId: string }>("/api/download", payload)

export const getFileUrl = (jobId: string) =>
  `${API_BASE}/api/file/${jobId}`

export const listenSSE = (
  jobId: string,
  onEvent: (data: ProgressEvent) => void,
  onError?: () => void
): (() => void) => {
  const source = new EventSource(`${API_BASE}/api/progress/${jobId}`)

  source.addEventListener("progress", (e: MessageEvent) => {
    try {
      onEvent(JSON.parse(e.data) as ProgressEvent)
    } catch {
      // ignore parse errors
    }
  })

  source.addEventListener("error", () => {
    onError?.()
    source.close()
  })

  source.onerror = () => {
    onError?.()
    source.close()
  }

  return () => source.close()
}

export function formatDuration(seconds: number): string {
  if (!seconds) return ""
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}
