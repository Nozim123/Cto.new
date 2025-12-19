import { useMemo, useState } from 'react'
import { Check, Copy, Facebook, Link2, Linkedin, MessageCircle, Send, Share2, Twitter, X } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

export default function ShareComponent({
  type = 'store',
  item,
  mallId,
  className = ''
}) {
  const { t } = useLanguage()
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = useMemo(() => {
    if (type === 'store') {
      return `${window.location.origin}/mall/${mallId}/store/${item.id}`
    }
    return `${window.location.origin}/product/${item.id}`
  }, [type, item?.id, mallId])

  const shareText = useMemo(() => {
    if (type === 'store') {
      return `${t('common.shareStore')}: ${item.name} - ${shareUrl}`
    }
    return `${t('common.shareProduct')}: ${item.name} - ${shareUrl}`
  }, [type, item?.name, shareUrl, t])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = shareUrl
      textarea.style.position = 'fixed'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      try {
        document.execCommand('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } finally {
        document.body.removeChild(textarea)
      }
    }
  }

  const handleNativeShare = async () => {
    if (!navigator.share) return

    try {
      await navigator.share({
        title: item?.name || (type === 'store' ? 'Store' : 'Product'),
        text: type === 'store' ? `${t('common.shareStore')}: ${item.name}` : `${t('common.shareProduct')}: ${item.name}`,
        url: shareUrl
      })
    } catch {
      // ignore
    }
  }

  const shareToSocial = (platform) => {
    const url = encodeURIComponent(shareUrl)
    const text = encodeURIComponent(shareText)

    let target = ''

    switch (platform) {
      case 'facebook':
        target = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
      case 'twitter':
        target = `https://twitter.com/intent/tweet?url=${url}&text=${text}`
        break
      case 'whatsapp':
        target = `https://wa.me/?text=${text}`
        break
      case 'telegram':
        target = `https://t.me/share/url?url=${url}&text=${text}`
        break
      case 'linkedin':
        target = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        break
      default:
        break
    }

    if (target) {
      window.open(target, '_blank', 'width=600,height=400')
    }
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setShowShareMenu((v) => !v)}
        className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300"
        aria-label={t('common.share') || 'Share'}
      >
        <Share2 className="text-white" size={18} />
      </button>

      {showShareMenu ? (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 z-50 p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">{t('common.share')}</div>
              <div className="text-xs text-gray-600 dark:text-white/60 truncate">{item?.name}</div>
            </div>
            <button
              type="button"
              onClick={() => setShowShareMenu(false)}
              className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label={t('common.close') || 'Close'}
            >
              <X size={16} className="text-gray-700 dark:text-white" />
            </button>
          </div>

          <div className="rounded-xl border border-gray-200/70 dark:border-white/10 bg-white/60 dark:bg-white/5 px-3 py-2 flex items-center gap-2 mb-3">
            <Link2 size={16} className="text-gray-500 dark:text-white/60 flex-shrink-0" />
            <input
              readOnly
              value={shareUrl}
              onFocus={(e) => e.target.select()}
              className="flex-1 bg-transparent outline-none text-xs text-gray-800 dark:text-white/90"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                copied
                  ? 'bg-green-500/15 text-green-700 dark:text-green-300'
                  : 'hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-white'
              }`}
              aria-label={t('common.copyLink') || 'Copy link'}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => shareToSocial('telegram')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm"
            >
              <Send size={16} className="text-blue-500" />
              Telegram
            </button>
            <button
              type="button"
              onClick={() => shareToSocial('whatsapp')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-sm"
            >
              <MessageCircle size={16} className="text-green-600" />
              WhatsApp
            </button>
            <button
              type="button"
              onClick={() => shareToSocial('facebook')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm"
            >
              <Facebook size={16} className="text-blue-600" />
              Facebook
            </button>
            <button
              type="button"
              onClick={() => shareToSocial('twitter')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors text-sm"
            >
              <Twitter size={16} className="text-sky-500" />
              Twitter
            </button>
            <button
              type="button"
              onClick={() => shareToSocial('linkedin')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors text-sm"
            >
              <Linkedin size={16} className="text-indigo-600" />
              LinkedIn
            </button>
            {navigator.share ? (
              <button
                type="button"
                onClick={handleNativeShare}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
              >
                <Share2 size={16} className="text-gray-700 dark:text-white" />
                More
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
              >
                <Copy size={16} className="text-gray-700 dark:text-white" />
                {copied ? t('common.copied') : t('common.copyLink')}
              </button>
            )}
          </div>
        </div>
      ) : null}

      {showShareMenu ? (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowShareMenu(false)}
          role="presentation"
        />
      ) : null}
    </div>
  )
}
