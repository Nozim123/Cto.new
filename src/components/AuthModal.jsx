import { useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useUser } from '../contexts/UserContext'

const generateOtp = () => String(Math.floor(1000 + Math.random() * 9000))

const nameFromEmail = (email) => {
  const safe = String(email || '').trim()
  if (!safe) return 'User'
  const [local] = safe.split('@')
  return local ? local.slice(0, 24) : 'User'
}

export default function AuthModal({ isOpen, onClose }) {
  const { darkMode } = useTheme()
  const { t } = useLanguage()
  const { login } = useUser()

  const modalRef = useRef(null)

  const [step, setStep] = useState('method')
  const [method, setMethod] = useState('email')
  const [identifier, setIdentifier] = useState('')
  const [otp, setOtp] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState(generateOtp)

  const label = useMemo(() => {
    if (method === 'phone') return t('auth.phone') || 'Phone number'
    return t('auth.email') || 'Email'
  }, [method, t])

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose()
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) return
    setStep('method')
    setMethod('email')
    setIdentifier('')
    setOtp('')
    setGeneratedOtp(generateOtp())
  }, [isOpen])

  if (!isOpen) return null

  const panelCls = darkMode ? 'bg-gray-900 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'

  const inputCls = darkMode
    ? 'bg-white/5 border-white/10 text-white placeholder:text-white/50'
    : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'

  const subtleText = darkMode ? 'text-white/70' : 'text-gray-600'

  const handleSocial = (provider) => {
    const now = Date.now()
    login(
      {
        id: `user-${now}`,
        name: provider === 'telegram' ? 'Telegram User' : 'Social User',
        email: `user${now}@${provider}.local`,
        role: 'user'
      },
      `user_token_${now}`
    )
    toast.success(t('auth.signedIn') || 'Signed in')
    onClose()
  }

  const startOtpFlow = () => {
    const trimmed = identifier.trim()
    if (!trimmed) return

    const nextOtp = generateOtp()
    setGeneratedOtp(nextOtp)
    setOtp('')
    setStep('otp')
    toast.success((t('auth.otpSent') || 'OTP sent') + ` • Demo: ${nextOtp}`)
  }

  const complete = () => {
    const now = Date.now()
    const trimmed = identifier.trim()

    login(
      {
        id: `user-${now}`,
        name: method === 'email' ? nameFromEmail(trimmed) : 'User',
        email: method === 'email' ? trimmed : `user${now}@phone.local`,
        phone: method === 'phone' ? trimmed : undefined,
        role: 'user'
      },
      `user_token_${now}`
    )

    toast.success(t('auth.welcome') || 'Welcome!')
    onClose()
  }

  const verifyOtp = () => {
    if (otp.trim() !== generatedOtp) {
      toast.error(t('auth.invalidOtp') || 'Invalid OTP')
      return
    }
    complete()
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div ref={modalRef} className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden ${panelCls}`}>
        <div className={`px-6 py-5 border-b ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              {t('auth.title') || 'Sign in'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'
              } transition-colors`}
              aria-label={t('common.close') || 'Close'}
            >
              <X size={18} />
            </button>
          </div>
          <p className={`${subtleText} text-sm mt-2`}>
            {t('auth.subtitle') || 'Minimal steps. OTP verification. Guest browsing available.'}
          </p>
        </div>

        <div className="p-6">
          {step === 'method' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMethod('email')
                    setStep('identifier')
                  }}
                  className="py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold"
                >
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMethod('phone')
                    setStep('identifier')
                  }}
                  className={`py-3 rounded-2xl border font-semibold ${
                    darkMode ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  Phone
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSocial('google')}
                  className={`py-3 rounded-2xl border text-sm font-semibold ${
                    darkMode ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => handleSocial('apple')}
                  className={`py-3 rounded-2xl border text-sm font-semibold ${
                    darkMode ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  Apple
                </button>
                <button
                  type="button"
                  onClick={() => handleSocial('telegram')}
                  className={`py-3 rounded-2xl border text-sm font-semibold ${
                    darkMode ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  Telegram
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className={`w-full py-3 rounded-2xl border font-semibold transition-colors ${
                  darkMode ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {t('auth.continueGuest') || 'Continue as guest'}
              </button>

              <p className={`${subtleText} text-xs`}>
                {t('auth.progressive') || 'Progressive disclosure: we ask only what we need, when we need it.'}
              </p>
            </div>
          ) : null}

          {step === 'identifier' ? (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                startOtpFlow()
              }}
            >
              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
                  {label}
                </label>
                <input
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className={`w-full px-4 py-3 rounded-2xl border outline-none focus:ring-2 focus:ring-purple-500/40 ${inputCls}`}
                  placeholder={method === 'phone' ? '+998 90 123 45 67' : 'you@example.com'}
                  type={method === 'phone' ? 'tel' : 'email'}
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('method')}
                  className={`flex-1 py-3 rounded-2xl border font-semibold ${
                    darkMode ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold shadow-lg"
                >
                  {t('auth.sendOtp') || 'Send OTP'}
                </button>
              </div>
            </form>
          ) : null}

          {step === 'otp' ? (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                verifyOtp()
              }}
            >
              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
                  {t('auth.otp') || 'OTP'}
                </label>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className={`w-full px-4 py-3 rounded-2xl border outline-none focus:ring-2 focus:ring-purple-500/40 tracking-[0.35em] text-center ${inputCls}`}
                  placeholder="••••"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={4}
                  required
                />
                <p className={`${subtleText} text-xs mt-2`}>Demo OTP: {generatedOtp}</p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('identifier')}
                  className={`flex-1 py-3 rounded-2xl border font-semibold ${
                    darkMode ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold"
                >
                  {t('auth.verify') || 'Verify'}
                </button>
              </div>

              <button
                type="button"
                onClick={startOtpFlow}
                className={`w-full py-3 rounded-2xl border font-semibold ${
                  darkMode ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                {t('auth.resend') || 'Resend OTP'}
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  )
}
