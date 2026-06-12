import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"
import { useDownloadStore } from "../store/useDownloadStore"

const STATUS_LABELS: Record<string, string> = {
  queued: "QUEUED...",
  downloading: "DOWNLOADING",
  converting: "CONVERTING",
  done: "READY ✓",
  error: "FAILED ✗",
}

export function ProgressBar() {
  const { progress, mode, appState } = useDownloadStore()

  if (appState !== "downloading" && appState !== "done") return null
  if (!progress) return null

  const { status, percent, speed, eta } = progress
  const isActive = status === "downloading" || status === "converting"
  const isDone = status === "done"
  const isError = status === "error"

  const barColor =
    isError ? "bg-mp3" :
    isDone ? "bg-ink" :
    mode === "mp3" ? "bg-mp3" : "bg-mp4"

  const displayPercent = status === "converting" ? 99 : percent

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ type: "spring", duration: 0.35, bounce: 0 }}
        className="mt-6 border-2 border-ink shadow-brutal bg-surface p-4"
      >
        {/* Top row: label + stats */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isActive && (
              <Loader2 size={12} className="animate-spin text-ink/60" />
            )}
            <span className="font-mono text-xs font-bold uppercase tracking-widest">
              {STATUS_LABELS[status] || status.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-4 font-mono text-xs text-ink/50 tabular-nums">
            {speed && <span>{speed}</span>}
            {eta && <span>ETA {eta}</span>}
            <span className="font-bold text-ink">{Math.round(displayPercent)}%</span>
          </div>
        </div>

        {/* Progress track */}
        <div className="h-3 w-full bg-paper border-2 border-ink overflow-hidden">
          <motion.div
            className={`h-full ${barColor}`}
            initial={{ width: "0%" }}
            animate={{ width: `${displayPercent}%` }}
            transition={{ ease: "easeOut", duration: 0.4 }}
          />
        </div>

        {/* Filename */}
        {progress.filename && (
          <p className="mt-2 font-mono text-xs text-ink/40 truncate">
            {progress.filename}
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
