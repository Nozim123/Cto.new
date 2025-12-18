import { useMemo } from 'react'
import AdminLayout from '../components/AdminLayout'
import { useEcosystem } from '../../contexts/EcosystemContext'

export default function SellerApprovalsPage() {
  const { state, approveSeller, rejectSeller } = useEcosystem()

  const requests = useMemo(() => {
    return (state.seller.requests || []).slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
  }, [state.seller.requests])

  const approvals = state.seller.approvalsByUserId || {}

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seller Approvals</h1>
          <p className="mt-2 text-gray-600">Approve store owners to access the seller dashboard.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Requests</h2>
            <div className="grid gap-3">
              {requests.length === 0 ? (
                <div className="text-sm text-gray-600 p-8 text-center">No requests yet.</div>
              ) : (
                requests.map((r) => (
                  <div key={r.id} className="p-4 rounded-lg border border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{r.storeName}</p>
                        <p className="text-xs text-gray-500 mt-1">{r.id}</p>
                        <p className="text-sm text-gray-700 mt-2">User: {r.userId}</p>
                        {r.email ? <p className="text-sm text-gray-700">Email: {r.email}</p> : null}
                        <p className="text-sm text-gray-700">Status: {r.status}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => approveSeller(r.id)}
                          disabled={r.status === 'approved'}
                          className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => rejectSeller(r.id)}
                          disabled={r.status === 'rejected'}
                          className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Approved owners</h2>
            <div className="space-y-3">
              {Object.keys(approvals).length === 0 ? (
                <p className="text-sm text-gray-600">No approved sellers yet.</p>
              ) : (
                Object.entries(approvals).map(([userId, data]) => (
                  <div key={userId} className="p-4 rounded-lg border border-gray-200">
                    <p className="font-semibold text-gray-900">{userId}</p>
                    <p className="text-xs text-gray-500 mt-1">Stores: {(data.storeIds || []).join(', ')}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
