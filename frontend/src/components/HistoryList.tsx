import { motion, AnimatePresence } from "framer-motion"
import { Download, Trash2, Clock } from "lucide-react"
import { useDownloadStore } from "../store/useDownloadStore"
import { useDownload } from "../hooks/useDownload"

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

export function HistoryList() {
  const { history, clearHistory } = useDownloadStore()
  const { downloadFile } = useDownload()

  if (history.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-10"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock size={13} className="text-ink/50" />
          <span className="font-mono text-xs uppercase tracking-widest text-ink/50">
            Recent Downloads
          </span>
        </div>
        <button
          onClick={clearHistory}
          className="flex items-center gap-1 font-mono text-xs text-ink/40
                     hover:text-ink transition-colors"
        >
          <Trash2 size={11} />
          Clear
        </button>
      </div>

      <div className="border-2 border-ink divide-y-2 divide-ink">
        <AnimatePresence initial={false}>
          {history.map((item) => (
            <motion.div
              key={item.jobId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ type: "spring", duration: 0.3, bounce: 0 }}
              className="flex items-center gap-3 px-3 py-2.5 bg-surface
                         hover:-translate-y-0.5 hover:shadow-brutal-sm
                         transition-all duration-100"
            >
              {/* Format badge */}
              <span
                className={`flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 text-paper
                           ${item.format === "mp3" ? "bg-mp3" : "bg-mp4"}`}
              >
                {item.format.toUpperCase()}
              </span>

              {/* Title + meta */}
              <div className="flex-1 min-w-0">
                <p className="font-mono text-xs font-bold truncate text-ink">
                  {item.title}
                </p>
                <p className="font-mono text-[10px] text-ink/40 mt-0.5">
                  {item.format === "mp3" ? `${item.quality}kbps` : `${item.quality}p`}
                  {item.filesize && ` · ${item.filesize}`}
                  {` · ${timeAgo(item.timestamp)}`}
                </p>
              </div>

              {/* Re-download button */}
              <button
                onClick={() => downloadFile(item.jobId)}
                title="Download again"
                className="flex-shrink-0 p-1.5 border border-ink/30 hover:border-ink
                           hover:bg-ink hover:text-paper transition-all duration-100"
              >
                <Download size={12} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
