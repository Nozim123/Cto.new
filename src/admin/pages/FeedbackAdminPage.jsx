import { useMemo, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { useEcosystem } from '../../contexts/EcosystemContext'

export default function FeedbackAdminPage() {
  const { state, updateFeedbackStatus } = useEcosystem()
  const [filter, setFilter] = useState('all')

  const items = useMemo(() => {
    const list = state.feedback.items || []
    const filtered = filter === 'all' ? list : list.filter((i) => i.status === filter)
    return filtered.slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
  }, [state.feedback.items, filter])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Feedback</h1>
            <p className="mt-2 text-gray-600">Review user feedback, feature requests, and issue reports.</p>
          </div>

          <div className="flex gap-2">
            {['all', 'open', 'reviewed', 'closed'].map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setFilter(k)}
                className={`px-4 py-2 rounded-lg border text-sm font-semibold ${
                  filter === k ? 'bg-navy text-white border-navy' : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {items.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-gray-600">No submissions yet.</div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                        {item.type}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-50 text-gray-700 border border-gray-100">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{item.id}</p>
                    <p className="mt-3 text-gray-900 whitespace-pre-wrap">{item.message}</p>
                    <p className="mt-3 text-xs text-gray-500">
                      User: {item.userId} {item.email ? `• ${item.email}` : ''}
                    </p>
                  </div>

                  <div className="flex-shrink-0 flex items-center gap-2">
                    <select
                      value={item.status}
                      onChange={(e) => updateFeedbackStatus(item.id, e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-200"
                    >
                      <option value="open">open</option>
                      <option value="reviewed">reviewed</option>
                      <option value="closed">closed</option>
                    </select>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
