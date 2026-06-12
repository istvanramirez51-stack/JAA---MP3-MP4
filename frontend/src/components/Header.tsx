import { motion } from "framer-motion"
import { useDownloadStore } from "../store/useDownloadStore"

export function Header() {
  const { mode, setMode } = useDownloadStore()

  return (
    <header className="sticky top-0 z-50 bg-paper border-b-2 border-ink">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-ink flex items-center justify-center">
            <div className="w-3 h-3 bg-yellow" />
          </div>
          <span className="font-display font-black text-lg tracking-tighter text-ink">
            JAA - Downloader MP3 & MP4
          </span>
        </div>

        {/* Mode switcher */}
        <div className="flex items-center gap-0 border-2 border-ink">
          {(["mp3", "mp4"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="relative px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest transition-colors duration-100"
            >
              {mode === m && (
                <motion.div
                  layoutId="mode-bg"
                  className="absolute inset-0 bg-ink"
                  transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                />
              )}
              <span className={`relative z-10 ${mode === m ? "text-paper" : "text-ink"}`}>
                {m}
              </span>
            </button>
          ))}
        </div>

        {/* Version badge */}
        <span className="font-mono text-xs border border-ink px-2 py-0.5 text-ink/50 hidden sm:block">
          v1.0.0 
        </span>
      </div>
    </header>
  )
}
