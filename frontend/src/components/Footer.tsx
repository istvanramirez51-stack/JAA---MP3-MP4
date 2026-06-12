export function Footer() {
  return (
    <footer className="mt-16 border-t-2 border-ink py-6">
      <div className="max-w-3xl mx-auto px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="font-display font-black text-sm text-ink">Jaa</span>
          <span className="font-mono text-xs text-ink/40 ml-3">
            Free & Open Source — Powered by yt-dlp
          </span>
        </div>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs border-2 border-ink px-3 py-1.5
                     shadow-brutal-sm hover:shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5
                     transition-all duration-100 flex items-center gap-1.5"
        >
          ★ Star on GitHub
        </a>
      </div>
    </footer>
  )
}
