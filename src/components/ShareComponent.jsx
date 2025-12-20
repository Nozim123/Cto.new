import { useState } from 'react'
import { Share2, Copy, Check } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

export default function ShareComponent({ 
  type = 'store', // 'store' or 'product'
  item,
  mallId,
  className = ""
}) {
  const { t } = useLanguage()
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  const getShareUrl = () => {
    if (type === 'store') {
      return `${window.location.origin}/mall/${mallId}/store/${item.id}`
    } else {
      return `${window.location.origin}/product/${item.id}`
    }
  }

  const getShareText = () => {
    if (type === 'store') {
      return `${t('common.shareStore')}: ${item.name} - ${window.location.origin}/mall/${mallId}/store/${item.id}`
    } else {
      return `${t('common.shareProduct')}: ${item.name} - ${window.location.origin}/product/${item.id}`
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: type === 'store' ? item.name : item.name,
          text: type === 'store' ? `${t('common.shareStore')}: ${item.name}` : `${t('common.shareProduct')}: ${item.name}`,
          url: getShareUrl()
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      setShowShareMenu(!showShareMenu)
    }
  }

  const shareToSocial = (platform) => {
    const url = encodeURIComponent(getShareUrl())
    const text = encodeURIComponent(getShareText())
    const title = encodeURIComponent(item.name)

    let shareUrl = ''
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}`
        break
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${url}&text=${text}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        break
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300 text-sm font-medium"
      >
        <Share2 className="w-4 h-4" />
        <span>{t('common.share')}</span>
      </button>

      {showShareMenu && !navigator.share && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 z-50 p-3">
          <div className="text-sm font-medium mb-3">{t('common.share')}</div>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => shareToSocial('facebook')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm"
            >
              <span className="text-blue-600">📘</span>
              Facebook
            </button>
            <button
              onClick={() => shareToSocial('twitter')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors text-sm"
            >
              <span className="text-sky-500">🐦</span>
              Twitter
            </button>
            <button
              onClick={() => shareToSocial('whatsapp')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-sm"
            >
              <span className="text-green-600">💬</span>
              WhatsApp
            </button>
            <button
              onClick={() => shareToSocial('telegram')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm"
            >
              <span className="text-blue-500">✈️</span>
              Telegram
            </button>
          </div>
          
          <div className="border-t border-white/20 pt-3">
            <button
              onClick={handleCopyLink}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                copied 
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? t('common.copied') : t('common.copyLink')}
            </button>
          </div>
        </div>
      )}

      {showShareMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </div>
  )
}