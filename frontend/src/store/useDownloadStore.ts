import { create } from "zustand"
import { VideoInfo, ProgressEvent } from "../lib/api"

export type AppMode = "mp3" | "mp4"
export type AppState = "idle" | "fetching-info" | "ready-to-download" | "downloading" | "done" | "error"

export interface HistoryItem {
  jobId: string
  title: string
  format: AppMode
  quality: string
  filesize?: string
  filename?: string
  timestamp: number
}

interface DownloadStore {
  // Mode
  mode: AppMode
  setMode: (mode: AppMode) => void

  // URL input
  url: string
  setUrl: (url: string) => void

  // Video info
  videoInfo: VideoInfo | null
  setVideoInfo: (info: VideoInfo | null) => void

  // Selected format quality
  selectedQuality: string
  setSelectedQuality: (q: string) => void

  // App state
  appState: AppState
  setAppState: (s: AppState) => void

  // Current job
  jobId: string | null
  setJobId: (id: string | null) => void

  // Progress
  progress: ProgressEvent | null
  setProgress: (p: ProgressEvent | null) => void

  // Error message
  errorMsg: string
  setErrorMsg: (msg: string) => void

  // History
  history: HistoryItem[]
  addToHistory: (item: HistoryItem) => void
  clearHistory: () => void

  // Reset to idle
  reset: () => void
}

export const useDownloadStore = create<DownloadStore>((set, get) => ({
  mode: "mp3",
  setMode: (mode) => {
    set({ mode, videoInfo: null, appState: "idle", progress: null, jobId: null, errorMsg: "", selectedQuality: mode === "mp3" ? "320" : "720" })
  },

  url: "",
  setUrl: (url) => set({ url }),

  videoInfo: null,
  setVideoInfo: (videoInfo) => set({ videoInfo }),

  selectedQuality: "320",
  setSelectedQuality: (selectedQuality) => set({ selectedQuality }),

  appState: "idle",
  setAppState: (appState) => set({ appState }),

  jobId: null,
  setJobId: (jobId) => set({ jobId }),

  progress: null,
  setProgress: (progress) => set({ progress }),

  errorMsg: "",
  setErrorMsg: (errorMsg) => set({ errorMsg }),

  history: [],
  addToHistory: (item) =>
    set((s) => ({ history: [item, ...s.history].slice(0, 10) })),
  clearHistory: () => set({ history: [] }),

  reset: () => set({
    appState: "idle",
    videoInfo: null,
    jobId: null,
    progress: null,
    errorMsg: "",
    selectedQuality: get().mode === "mp3" ? "320" : "720",
  }),
}))
