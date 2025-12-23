import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import { toast } from 'react-hot-toast'

export default function StoreShareButton({ storeId, storeName }) {
  const [isSharing, setIsSharing] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const { darkMode } = useTheme()
  const { t } = useLanguage()

  const generateShareableLink = () => {
    const baseUrl = window.location.origin
    return `${baseUrl}/mall/store/${storeId}?ref=share`
  }

  const shareLink = generateShareableLink()

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      toast.success('Link copied to clipboard!')
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = shareLink
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      toast.success('Link copied to clipboard!')
    }
    setShowDropdown(false)
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        setIsSharing(true)
        await navigator.share({
          title: `Check out ${storeName}`,
          text: `Visit this amazing store: ${storeName}`,
          url: shareLink,
        })
        toast.success('Shared successfully!')
      } catch (err) {
        if (err.name !== 'AbortError') {
          toast.error('Sharing failed')
        }
      } finally {
        setIsSharing(false)
      }
    } else {
      copyToClipboard()
    }
  }

  const shareToSocialMedia = (platform) => {
    const text = `Check out this amazing store: ${storeName}`
    const url = encodeURIComponent(shareLink)
    const encodedText = encodeURIComponent(text)

    let shareUrl = ''
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${url}`
        break
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${url}&text=${encodedText}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}%20${url}`
        break
      default:
        return
    }

    window.open(shareUrl, '_blank', 'width=600,height=400')
    setShowDropdown(false)
  }

  return (
    <div className="relative">
      {/* Native Share Button */}
      <button
        onClick={handleNativeShare}
        disabled={isSharing}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
          darkMode 
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        } ${isSharing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className="text-sm">
          {isSharing ? 'Sharing...' : '📤 Share'}
        </span>
      </button>

      {/* Dropdown Toggle */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`ml-2 inline-flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
          darkMode 
            ? 'bg-gray-600 hover:bg-gray-700 text-white' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        }`}
      >
        <span className="text-sm">▼</span>
      </button>

      {/* Social Media Dropdown */}
      {showDropdown && (
        <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 min-w-[200px] z-50">
          <div className="space-y-2">
            <button
              onClick={() => shareToSocialMedia('facebook')}
              className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <span className="text-blue-600">📘</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">Share on Facebook</span>
            </button>
            
            <button
              onClick={() => shareToSocialMedia('twitter')}
              className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <span className="text-blue-400">🐦</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">Share on Twitter</span>
            </button>
            
            <button
              onClick={() => shareToSocialMedia('telegram')}
              className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <span className="text-blue-500">✈️</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">Share on Telegram</span>
            </button>
            
            <button
              onClick={() => shareToSocialMedia('whatsapp')}
              className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <span className="text-green-500">💬</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">Share on WhatsApp</span>
            </button>
            
            <hr className="border-gray-200 dark:border-gray-600" />
            
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <span className="text-gray-600">🔗</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">Copy Link</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  )
}