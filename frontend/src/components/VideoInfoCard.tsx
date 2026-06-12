import { motion } from "framer-motion"
import { Play, Clock, User } from "lucide-react"
import { useDownloadStore } from "../store/useDownloadStore"
import { useDownload } from "../hooks/useDownload"
import { FormatSelector } from "./FormatSelector"
import { formatDuration } from "../lib/api"

export function VideoInfoCard() {
  const { videoInfo, mode, appState } = useDownloadStore()
  const { startDownload, reset } = useDownload()

  if (!videoInfo) return null

  const isDownloading = appState === "downloading"
  const accentColor = mode === "mp3" ? "bg-mp3" : "bg-mp4"
  const shadowClass = mode === "mp3" ? "shadow-brutal-mp3" : "shadow-brutal-mp4"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: "spring", duration: 0.4, bounce: 0 }}
      className="mt-6 border-2 border-ink shadow-brutal bg-surface"
    >
      {/* Video preview row */}
      <div className="flex gap-4 p-4 border-b-2 border-ink">
        {/* Thumbnail */}
        <div className="flex-shrink-0 w-24 h-16 sm:w-32 sm:h-20 border-2 border-ink overflow-hidden relative bg-ink/10">
          {videoInfo.thumbnail ? (
            <img
              src={videoInfo.thumbnail}
              alt={videoInfo.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Play size={20} className="text-ink/30" />
            </div>
          )}
          {/* Format badge overlay */}
          <div className={`absolute top-1 left-1 ${accentColor} text-paper font-mono text-[10px] font-bold px-1.5 py-0.5`}>
            {mode.toUpperCase()}
          </div>
        </div>

        {/* Meta */}
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-sm sm:text-base leading-tight line-clamp-2 text-ink">
            {videoInfo.title}
          </h3>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {videoInfo.uploader && (
              <span className="flex items-center gap-1 font-mono text-xs text-ink/50">
                <User size={11} />
                {videoInfo.uploader}
              </span>
            )}
            {videoInfo.duration > 0 && (
              <span className="flex items-center gap-1 font-mono text-xs text-ink/50">
                <Clock size={11} />
                {formatDuration(videoInfo.duration)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Format selector */}
      <div className="p-4 border-b-2 border-ink">
        <FormatSelector />
      </div>

      {/* Actions */}
      <div className="p-4 flex gap-2">
        <motion.button
          onClick={startDownload}
          disabled={isDownloading}
          whileTap={{ scale: 0.97, x: 3, y: 3, boxShadow: "1px 1px 0px #0D0D0D" }}
          className={`flex-1 flex items-center justify-center gap-2
                     ${accentColor} text-paper
                     border-2 border-ink ${shadowClass}
                     py-3 font-mono font-bold text-sm uppercase tracking-wider
                     hover:-translate-x-0.5 hover:-translate-y-0.5
                     transition-all duration-100
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
        >
          START DOWNLOAD
        </motion.button>

        <motion.button
          onClick={reset}
          disabled={isDownloading}
          whileTap={{ scale: 0.97, x: 2, y: 2 }}
          className="px-4 py-3 border-2 border-ink shadow-brutal-sm font-mono text-xs
                     uppercase tracking-wider hover:bg-ink hover:text-paper
                     transition-colors duration-100 disabled:opacity-40"
        >
          RESET
        </motion.button>
      </div>
    </motion.div>
  )
}
