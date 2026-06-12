import { useCallback, useRef } from "react"
import { getInfo, startJob, listenSSE, getFileUrl } from "../lib/api"
import { useDownloadStore } from "../store/useDownloadStore"

export function useDownload() {
  const store = useDownloadStore()
  const cleanupSSE = useRef<(() => void) | null>(null)

  const fetchInfo = useCallback(async (url: string) => {
    store.setAppState("fetching-info")
    store.setErrorMsg("")
    store.setVideoInfo(null)
    store.setUrl(url)

    try {
      const res = await getInfo(url)
      store.setVideoInfo(res.data)
      store.setAppState("ready-to-download")
      // Set default quality
      const defaults = store.mode === "mp3" ? "320" : "720"
      store.setSelectedQuality(defaults)
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        "Could not fetch video info. Please check the URL."
      store.setErrorMsg(msg)
      store.setAppState("error")
    }
  }, [store])

  const startDownload = useCallback(async () => {
    if (!store.url || !store.videoInfo) return

    store.setAppState("downloading")
    store.setErrorMsg("")

    try {
      const res = await startJob({
        url: store.url,
        format: store.mode,
        quality: store.selectedQuality,
      })

      const jobId = res.data.jobId
      store.setJobId(jobId)

      // Clean up previous SSE
      cleanupSSE.current?.()

      cleanupSSE.current = listenSSE(
        jobId,
        (event) => {
          store.setProgress(event)

          if (event.status === "done") {
            store.setAppState("done")
            store.addToHistory({
              jobId,
              title: store.videoInfo?.title || "Unknown",
              format: store.mode,
              quality: store.selectedQuality,
              filesize: event.filesize,
              filename: event.filename,
              timestamp: Date.now(),
            })
            cleanupSSE.current?.()
          }

          if (event.status === "error") {
            store.setErrorMsg(event.error || "Download failed.")
            store.setAppState("error")
            cleanupSSE.current?.()
          }
        },
        () => {
          if (store.appState !== "done") {
            store.setErrorMsg("Connection to server lost. Please try again.")
            store.setAppState("error")
          }
        }
      )
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        "Failed to start download."
      store.setErrorMsg(msg)
      store.setAppState("error")
    }
  }, [store])

  const downloadFile = useCallback((jobId: string) => {
    const url = getFileUrl(jobId)
    const a = document.createElement("a")
    a.href = url
    a.download = ""
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }, [])

  const reset = useCallback(() => {
    cleanupSSE.current?.()
    store.reset()
  }, [store])

  return { fetchInfo, startDownload, downloadFile, reset }
}
