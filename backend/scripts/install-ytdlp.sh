#!/bin/bash
set -e

echo "[rawload] Installing yt-dlp..."
YTDLP_VERSION="2024.10.22"
curl -L "https://github.com/yt-dlp/yt-dlp/releases/download/${YTDLP_VERSION}/yt-dlp_linux" \
  -o /usr/local/bin/yt-dlp
chmod +x /usr/local/bin/yt-dlp
echo "[rawload] yt-dlp installed: $(yt-dlp --version)"

echo "[rawload] Installing ffmpeg..."
apt-get update -qq && apt-get install -y -qq ffmpeg 2>/dev/null || \
  (echo "[rawload] apt-get failed, trying alternative..." && \
   which ffmpeg && echo "ffmpeg already available" || echo "ffmpeg not available, conversions may fail")

echo "[rawload] Setup complete."
