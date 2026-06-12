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
  : ["http://localhost:5173", "http://localhost:4173"]

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
      cb(null, true)
    } else {
      cb(new Error(`CORS: origin ${origin} not allowed`))
    }
  },
  credentials: true,
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
  console.log(`[rawload] Allowed origins: ${allowedOrigins.join(", ")}`)
})
