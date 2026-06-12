import { motion } from "framer-motion"
import { useDownloadStore } from "../store/useDownloadStore"

const FORMAT_OPTIONS = {
  mp3: [
    { value: "128", label: "MP3 128kbps", desc: "Smaller file" },
    { value: "320", label: "MP3 320kbps", desc: "Best quality" },
  ],
  mp4: [
    { value: "720", label: "MP4 720p", desc: "HD" },
    { value: "1080", label: "MP4 1080p", desc: "Full HD" },
  ],
}

export function FormatSelector() {
  const { mode, selectedQuality, setSelectedQuality, videoInfo } = useDownloadStore()

  const options = FORMAT_OPTIONS[mode].filter((opt) => {
    if (mode === "mp4" && opt.value === "1080") {
      return videoInfo?.formats.mp4.includes("1080p")
    }
    return true
  })

  return (
    <div className="mt-4">
      <p className="font-mono text-xs uppercase tracking-widest text-ink/50 mb-2">
        Select Quality
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selectedQuality === opt.value
          return (
            <motion.button
              key={opt.value}
              onClick={() => setSelectedQuality(opt.value)}
              whileTap={{ scale: 0.97, x: 2, y: 2 }}
              className={`relative border-2 border-ink font-mono text-xs px-4 py-2
                         transition-all duration-100
                         hover:-translate-x-0.5 hover:-translate-y-0.5
                         ${isSelected
                           ? mode === "mp3"
                             ? "bg-mp3 text-paper shadow-brutal-mp3"
                             : "bg-mp4 text-paper shadow-brutal-mp4"
                           : "bg-surface text-ink shadow-brutal-sm hover:shadow-brutal"
                         }`}
            >
              <span className="font-bold">{opt.label}</span>
              <span className={`ml-2 ${isSelected ? "opacity-70" : "text-ink/40"}`}>
                — {opt.desc}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
