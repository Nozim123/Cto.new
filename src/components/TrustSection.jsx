import { useTheme } from '../contexts/ThemeContext'

export default function TrustSection() {
  const { darkMode } = useTheme()

  const items = [
    {
      title: 'Verified stores',
      text: 'Stores can be labeled as verified for higher user trust.'
    },
    {
      title: 'Secure checkout-ready',
      text: 'Payment integrations can be added with secure badges and policies.'
    },
    {
      title: 'User protection',
      text: 'Transparent returns, pickup confirmation, and issue reporting.'
    }
  ]

  return (
    <section className="relative z-10 py-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className={`p-8 rounded-3xl border ${darkMode ? 'border-white/10 bg-white/5 text-white' : 'border-gray-200 bg-white text-gray-900'}`}>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Security & Trust</h2>
              <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} text-sm mt-1`}>
                Designed to build confidence in a hybrid online/offline mall ecosystem.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-200 border border-green-500/30">
                Secure
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-200 border border-purple-500/30">
                Verified
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item.title}
                className={`p-5 rounded-2xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}
              >
                <p className="font-semibold mb-2">{item.title}</p>
                <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} text-sm leading-relaxed`}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
