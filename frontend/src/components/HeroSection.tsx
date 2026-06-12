import { motion, useReducedMotion } from "framer-motion"
import { useDownloadStore } from "../store/useDownloadStore"

const containerVariants = {
  animate: { transition: { staggerChildren: 0.08 } }
}

const lineVariants = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0, transition: { type: "spring", duration: 0.5, bounce: 0 } }
}

export function HeroSection() {
  const { mode } = useDownloadStore()
  const prefersReduced = useReducedMotion()

  const tagline = mode === "mp3"
    ? "Convert To Audio."
    : "Convert TO VIDEO."

  return (
    <motion.div
      className="mb-8 overflow-hidden"
      variants={prefersReduced ? {} : containerVariants}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={prefersReduced ? {} : lineVariants}>
        <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl tracking-tighter leading-none text-ink">
          CTRL + C, CRTL + V, &nbsp;
        </h1>
      </motion.div>

      <motion.div variants={prefersReduced ? {} : lineVariants}>
        <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl tracking-tighter leading-none">
          <span className={`${mode === "mp3" ? "text-mp3" : "text-mp4"}`}>
            {tagline}
          </span>
        </h1>
      </motion.div>

      <motion.div
        variants={prefersReduced ? {} : lineVariants}
        className="mt-4 h-0.5 bg-ink w-24"
      />

      <motion.p
        variants={prefersReduced ? {} : lineVariants}
        className="mt-3 font-mono text-sm text-ink/60 max-w-sm"
      >
        No watermarks. No sign-up. No tracking.
        <br />
        Paste a URL and download.
      </motion.p>
    </motion.div>
  )
}
