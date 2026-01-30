import { useMemo } from 'react'
import AdminLayout from '../components/AdminLayout'
import { useEcosystem } from '../../contexts/EcosystemContext'

export default function NotificationsPage() {
  const { state } = useEcosystem()

  const notifications = useMemo(() => {
    return (state.notifications?.items || []).slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
  }, [state.notifications?.items])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-2 text-gray-600">Real-time system events (orders, seller approvals, etc.).</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Feed</h2>
            <p className="text-sm text-gray-600 mt-1">Newest first</p>
          </div>

          <div className="p-6">
            {notifications.length === 0 ? (
              <div className="text-sm text-gray-600 p-8 text-center">No notifications yet.</div>
            ) : (
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className="p-4 rounded-lg border border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{n.title || n.type}</p>
                        <p className="text-sm text-gray-700 mt-1">{n.message}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          {n.type ? <span className="px-2 py-1 rounded-full bg-gray-100">{n.type}</span> : null}
                          {n.audience ? <span className="px-2 py-1 rounded-full bg-gray-100">{n.audience}</span> : null}
                          {n.storeId ? <span className="px-2 py-1 rounded-full bg-gray-100">store: {n.storeId}</span> : null}
                          {n.userId ? <span className="px-2 py-1 rounded-full bg-gray-100">user: {n.userId}</span> : null}
                        </div>
                      </div>

                      <div className="flex-shrink-0 text-xs text-gray-500">
                        {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
