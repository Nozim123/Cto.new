import { Copy, Send, Share2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ShareButtons({ title, text }) {
  const url = typeof window !== 'undefined' ? window.location.href : ''

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url })
        return
      }
      await navigator.clipboard.writeText(url)
      toast.success('Link copied')
    } catch {
      toast.error('Unable to share')
    }
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied')
    } catch {
      toast.error('Copy failed')
    }
  }

  const telegramHref = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text || title || '')}`

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={share} className="button-secondary inline-flex items-center gap-2">
        <Share2 className="w-4 h-4" />
        Share
      </button>
      <a
        href={telegramHref}
        target="_blank"
        rel="noreferrer"
        className="button-secondary inline-flex items-center gap-2"
      >
        <Send className="w-4 h-4" />
        Telegram
      </a>
      <button type="button" onClick={copy} className="button-secondary inline-flex items-center gap-2">
        <Copy className="w-4 h-4" />
        Copy
      </button>
    </div>
  )
}
