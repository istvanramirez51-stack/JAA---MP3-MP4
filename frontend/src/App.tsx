import { AnimatePresence, motion } from "framer-motion"
import { Header } from "./components/Header"
import { HeroSection } from "./components/HeroSection"
import { DownloadForm } from "./components/DownloadForm"
import { VideoInfoCard } from "./components/VideoInfoCard"
import { ProgressBar } from "./components/ProgressBar"
import { ResultCard } from "./components/ResultCard"
import { HistoryList } from "./components/HistoryList"
import { Footer } from "./components/Footer"
import { useDownloadStore } from "./store/useDownloadStore"
import "./styles/globals.css"
import { useEffect } from "react"
import { API_BASE } from "./lib/api"

export default function App() {
  const { mode, appState } = useDownloadStore()

  // Warm up backend on load (handles Railway cold start)
  useEffect(() => {
    fetch(`${API_BASE}/health`).catch(() => {})
  }, [])

  const showInfoCard = appState === "ready-to-download" || appState === "downloading" || appState === "done" || appState === "error"

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10 sm:py-16">
        {/* Hero — animates on mode change */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
          >
            <HeroSection />
          </motion.div>
        </AnimatePresence>

        {/* Form is always visible */}
        <DownloadForm />

        {/* Info / progress / result panels */}
        <AnimatePresence>
          {showInfoCard && (
            <motion.div
              key="panels"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <VideoInfoCard />
              <ProgressBar />
              <ResultCard />
            </motion.div>
          )}
        </AnimatePresence>

        {/* History */}
        <HistoryList />
      </main>

      <Footer />
    </div>
  )
}
