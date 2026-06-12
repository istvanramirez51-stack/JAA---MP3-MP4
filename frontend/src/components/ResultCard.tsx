import { motion } from "framer-motion"
import { Download, RotateCcw, FileAudio, FileVideo } from "lucide-react"
import { useDownloadStore } from "../store/useDownloadStore"
import { useDownload } from "../hooks/useDownload"

export function ResultCard() {
  const { appState, jobId, progress, mode, videoInfo, selectedQuality } = useDownloadStore()
  const { downloadFile, reset } = useDownload()

  if (appState !== "done" || !jobId) return null

  const isAudio = mode === "mp3"
  const FileIcon = isAudio ? FileAudio : FileVideo
  const accentColor = isAudio ? "bg-mp3" : "bg-mp4"
  const shadowClass = isAudio ? "shadow-brutal-mp3" : "shadow-brutal-mp4"
  const qualityLabel = isAudio
    ? `MP3 ${selectedQuality}kbps`
    : `MP4 ${selectedQuality}p`

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", duration: 0.45, bounce: 0.1 }}
      className="mt-6 border-2 border-ink shadow-brutal-lg bg-yellow"
    >
      {/* Header */}
      <div className="border-b-2 border-ink px-4 py-2 flex items-center gap-2 bg-ink">
        <FileIcon size={14} className="text-yellow" />
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-yellow">
          Ready to download
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        {videoInfo && (
          <div className="flex gap-3 mb-4">
            {videoInfo.thumbnail && (
              <img
                src={videoInfo.thumbnail}
                alt=""
                className="w-16 h-12 object-cover border-2 border-ink flex-shrink-0"
              />
            )}
            <div className="min-w-0">
              <p className="font-display font-bold text-sm leading-tight line-clamp-2 text-ink">
                {videoInfo.title}
              </p>
              <p className="font-mono text-xs text-ink/60 mt-1">{qualityLabel}</p>
            </div>
          </div>
        )}

        {/* File info */}
        {progress?.filesize && (
          <div className="flex gap-4 mb-4 font-mono text-xs text-ink/60">
            <span>Size: {progress.filesize}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2">
          <motion.button
            onClick={() => downloadFile(jobId)}
            whileTap={{ scale: 0.97, x: 3, y: 3, boxShadow: "1px 1px 0px #0D0D0D" }}
            className={`flex-1 flex items-center justify-center gap-2
                       ${accentColor} text-paper
                       border-2 border-ink ${shadowClass}
                       py-3 font-mono font-bold text-sm uppercase tracking-wider
                       hover:-translate-x-0.5 hover:-translate-y-0.5
                       transition-all duration-100`}
          >
            <Download size={15} />
            DOWNLOAD {qualityLabel}
          </motion.button>

          <motion.button
            onClick={reset}
            whileTap={{ scale: 0.97, x: 2, y: 2 }}
            className="px-4 py-3 border-2 border-ink shadow-brutal-sm font-mono text-xs
                       uppercase tracking-wider bg-surface hover:bg-ink hover:text-paper
                       transition-colors duration-100"
            title="Download another"
          >
            <RotateCcw size={14} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
