import "dotenv/config"
import express from "express"
import cors from "cors"
import { downloadRouter } from "./routes/download"
import { progressRouter } from "./routes/progress"
import { infoRouter } from "./routes/info"
import { fileRouter } from "./routes/file"

const app = express()
const PORT = process.env.PORT || 3001

// CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
  : []

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (mobile, curl, server-to-server)
    if (!origin) return cb(null, true)
    // Allow localhost always
    if (origin.includes("localhost")) return cb(null, true)
    // Allow if in whitelist
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) return cb(null, true)
    // Allow all vercel.app and railway.app subdomains
    if (origin.endsWith(".vercel.app") || origin.endsWith(".railway.app")) return cb(null, true)
    console.warn(`[CORS] Blocked origin: ${origin}`)
    cb(new Error(`CORS: origin ${origin} not allowed`))
  },
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Accept", "ngrok-skip-browser-warning", "x-action"],
}))

app.use(express.json())

// Trust Railway proxy
app.set("trust proxy", 1)

// Routes
app.use("/api/info",     infoRouter)
app.use("/api/download", downloadRouter)
app.use("/api/progress", progressRouter)
app.use("/api/file",     fileRouter)

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", version: "1.0.0", ts: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`[rawload] API running on :${PORT}`)
  console.log(`[rawload] Allowed origins: ${allowedOrigins.join(", ") || "all vercel.app + railway.app"}`)
})