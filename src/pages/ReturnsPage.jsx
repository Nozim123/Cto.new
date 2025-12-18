import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useEcosystem } from '../contexts/EcosystemContext'

export default function ReturnsPage() {
  const { darkMode } = useTheme()
  const { userId, state, submitReturnRequest, getStoreById } = useEcosystem()

  const [orderId, setOrderId] = useState('')
  const [reason, setReason] = useState('')

  const orders = useMemo(() => (state.orders.items || []).filter((o) => o.userId === userId), [state.orders.items, userId])
  const returns = useMemo(() => (state.returns.items || []).filter((r) => r.userId === userId), [state.returns.items, userId])

  return (
    <div className={`min-h-screen pt-24 pb-24 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-5xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between gap-3 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Refunds & Returns</h1>
            <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} mt-1`}>
              Transparent requests, status tracking, and store responses.
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
          <h2 className="text-lg font-semibold mb-4">Request a return</h2>
          <form
            className="grid grid-cols-1 md:grid-cols-3 gap-3"
            onSubmit={(e) => {
              e.preventDefault()
              const id = submitReturnRequest({ orderId, reason })
              if (id) {
                setOrderId('')
                setReason('')
              }
            }}
          >
            <select
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className={`px-4 py-3 rounded-2xl border outline-none ${
                darkMode ? 'bg-gray-900/40 border-white/10' : 'bg-white border-gray-200'
              }`}
              required
            >
              <option value="">Select order</option>
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.id} ({o.status})
                </option>
              ))}
            </select>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason (optional)"
              className={`px-4 py-3 rounded-2xl border outline-none ${
                darkMode ? 'bg-gray-900/40 border-white/10' : 'bg-white border-gray-200'
              }`}
            />
            <button
              type="submit"
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold"
            >
              Submit
            </button>
          </form>
        </div>

        <div className="mt-6 grid gap-4">
          {returns.length === 0 ? (
            <div className={`p-10 rounded-3xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
              <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'}`}>No return requests yet.</p>
            </div>
          ) : (
            returns.map((r) => {
              const store = getStoreById(r.storeId)
              return (
                <div
                  key={r.id}
                  className={`p-6 rounded-3xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold">Return request</p>
                      <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} text-xs mt-1 truncate`}>{r.id}</p>
                      <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} text-sm mt-3`}>Order: {r.orderId}</p>
                      <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} text-sm`}>Store: {store?.name || r.storeId}</p>
                      <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} text-sm`}>Status: {r.status}</p>
                      {r.reason ? (
                        <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} text-sm mt-2`}>Reason: {r.reason}</p>
                      ) : null}
                      {r.storeMessage ? (
                        <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} text-sm mt-2`}>Store: {r.storeMessage}</p>
                      ) : null}
                    </div>
                    <div
                      className={`px-3 py-2 rounded-xl text-xs font-semibold ${
                        r.status === 'approved'
                          ? 'bg-green-500/20 text-green-300'
                          : r.status === 'rejected'
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-yellow-500/20 text-yellow-300'
                      }`}
                    >
                      {r.status}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
