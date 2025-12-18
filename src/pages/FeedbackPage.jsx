import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useEcosystem } from '../contexts/EcosystemContext'

export default function FeedbackPage() {
  const { darkMode } = useTheme()
  const { submitFeedback } = useEcosystem()

  const [type, setType] = useState('feedback')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <div className={`min-h-screen pt-24 pb-24 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-3xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between gap-3 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Feedback & Feature Requests</h1>
            <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} mt-1`}>
              Suggest new features, report issues, or share feedback.
            </p>
          </div>
          <Link
            to="/"
            className={`px-4 py-2 rounded-xl text-sm font-semibold border ${
              darkMode ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}
          >
            Back
          </Link>
        </div>

        <div className={`p-6 rounded-3xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
          {sent ? (
            <div>
              <p className="text-lg font-semibold mb-2">Thanks!</p>
              <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} mb-6`}>
                Your submission has been sent to the admin team.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSent(false)
                  setMessage('')
                }}
                className="px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold"
              >
                Send another
              </button>
            </div>
          ) : (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                const id = submitFeedback({ type, message, email })
                if (id) setSent(true)
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={`${darkMode ? 'text-white/70' : 'text-gray-600'} text-sm font-semibold block mb-2`}>
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border outline-none ${
                      darkMode ? 'bg-gray-900/40 border-white/10' : 'bg-white border-gray-200'
                    }`}
                  >
                    <option value="feedback">Feedback</option>
                    <option value="feature">Feature request</option>
                    <option value="bug">Report issue</option>
                  </select>
                </div>

                <div>
                  <label className={`${darkMode ? 'text-white/70' : 'text-gray-600'} text-sm font-semibold block mb-2`}>
                    Email (optional)
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    type="email"
                    className={`w-full px-4 py-3 rounded-2xl border outline-none ${
                      darkMode ? 'bg-gray-900/40 border-white/10' : 'bg-white border-gray-200'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`${darkMode ? 'text-white/70' : 'text-gray-600'} text-sm font-semibold block mb-2`}>
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  placeholder="Tell us what you want to improve…"
                  className={`w-full px-4 py-3 rounded-2xl border outline-none ${
                    darkMode ? 'bg-gray-900/40 border-white/10' : 'bg-white border-gray-200'
                  }`}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold"
              >
                Submit
              </button>

              <div className={`p-4 rounded-2xl ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
                <p className="text-sm font-semibold mb-1">Security & Trust</p>
                <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} text-sm`}>
                  We never ask for passwords via email. Verified stores are labeled, and user protection policies apply to pickup and returns.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
