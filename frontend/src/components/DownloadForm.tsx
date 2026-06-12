import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { ClipboardPaste, ArrowRight, Loader2 } from "lucide-react"
import { urlSchema, UrlFormValues } from "../lib/validators"
import { useDownloadStore } from "../store/useDownloadStore"
import { useDownload } from "../hooks/useDownload"

const PLATFORMS = ["YouTube", "Instagram", "TikTok", "Twitter/X", "Facebook", "SoundCloud", "Vimeo"]

export function DownloadForm() {
  const { appState, mode, errorMsg } = useDownloadStore()
  const { fetchInfo } = useDownload()
  const prefersReduced = useReducedMotion()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UrlFormValues>({
    resolver: zodResolver(urlSchema),
  })

  const onSubmit = (data: UrlFormValues) => {
    fetchInfo(data.url)
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setValue("url", text, { shouldValidate: true })
    } catch {
      // clipboard access denied
    }
  }

  const isLoading = appState === "fetching-info"
  const accentColor = mode === "mp3" ? "bg-mp3" : "bg-mp4"
  const shadowClass = mode === "mp3" ? "shadow-brutal-mp3" : "shadow-brutal-mp4"

  return (
    <motion.div
      initial={prefersReduced ? {} : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: [0.2, 0, 0, 1] }}
      className="w-full"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        {/* Input row */}
        <div className="flex gap-0 border-2 border-ink shadow-brutal bg-surface">
          <input
            {...register("url")}
            type="url"
            placeholder="https://youtube.com/watch?v=..."
            autoComplete="off"
            spellCheck={false}
            disabled={isLoading}
            className="flex-1 min-w-0 font-mono text-sm px-4 py-4 bg-transparent
                       focus:outline-none placeholder:text-ink/30
                       disabled:opacity-50"
          />

          {/* Paste button */}
          <button
            type="button"
            onClick={handlePaste}
            disabled={isLoading}
            title="Paste from clipboard"
            className="border-l-2 border-ink px-4 hover:bg-yellow transition-colors duration-100
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ClipboardPaste size={16} className="text-ink" />
          </button>
        </div>

        {/* Error */}
        <AnimatePresence>
          {(errors.url || errorMsg) && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="font-mono text-xs text-mp3 mt-2 border-l-2 border-mp3 pl-2"
            >
              {errors.url?.message || errorMsg}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Submit button */}
        <motion.button
          type="submit"
          disabled={isLoading}
          whileTap={prefersReduced ? {} : { scale: 0.98, x: 3, y: 3, boxShadow: "1px 1px 0px #0D0D0D" }}
          className={`mt-3 w-full flex items-center justify-center gap-3
                     ${accentColor} text-paper
                     border-2 border-ink ${shadowClass}
                     py-4 font-mono font-bold text-sm uppercase tracking-widest
                     hover:-translate-x-0.5 hover:-translate-y-0.5
                     transition-all duration-100
                     disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none`}
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Download...
            </>
          ) : (
            <>
              Download {mode.toUpperCase()} sekarang 
              <ArrowRight size={16} />
            </>
          )}
        </motion.button>
      </form>

      {/* Supported platforms */}
      <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
        <span className="font-mono text-xs text-ink/40 uppercase tracking-widest">Supports:</span>
        {PLATFORMS.map((p) => (
          <span key={p} className="font-mono text-xs text-ink/50">
            {p}
          </span>
        ))}
      </div>
    </motion.div>
  )
}
