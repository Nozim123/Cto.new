import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'
import { useTheme } from '../contexts/ThemeContext'
import { useEcosystem } from '../contexts/EcosystemContext'

function QrBlock({ value }) {
  const { darkMode } = useTheme()
  const [src, setSrc] = useState('')

  useEffect(() => {
    let mounted = true
    QRCode.toDataURL(value, { margin: 1, width: 220 })
      .then((url) => {
        if (mounted) setSrc(url)
      })
      .catch(() => {
        if (mounted) setSrc('')
      })

    return () => {
      mounted = false
    }
  }, [value])

  return (
    <div className={`p-4 rounded-2xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
      <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} text-xs mb-3`}>Pickup QR</p>
      {src ? <img src={src} alt="Pickup QR" className="w-[220px] h-[220px]" /> : <p className="text-sm">Generating…</p>}
    </div>
  )
}

export default function OrdersPage() {
  const { darkMode } = useTheme()
  const { userId, state, createDemoOrder, confirmPickup, getStoreById, getProductById } = useEcosystem()

  const orders = useMemo(() => {
    return (state.orders.items || [])
      .filter((o) => o.userId === userId)
      .slice()
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
  }, [state.orders.items, userId])

  return (
    <div className={`min-h-screen pt-24 pb-24 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-5xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between gap-3 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Orders & Pickup</h1>
            <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} mt-1`}>
              QR-based pickup bridging online and in-mall experience.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-sm font-semibold border ${
                darkMode ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              Back
            </Link>
            <button
              type="button"
              onClick={() => createDemoOrder('tp-001')}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-500 to-purple-700 text-white"
            >
              Create demo order
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {orders.length === 0 ? (
            <div className={`p-10 rounded-3xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
              <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                No orders yet. Create a demo order to preview the pickup flow.
              </p>
            </div>
          ) : (
            orders.map((order) => {
              const store = getStoreById(order.storeId)
              const product = getProductById(order.productIds?.[0])

              return (
                <div
                  key={order.id}
                  className={`p-6 rounded-3xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">Order</p>
                      <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} text-xs mt-1 truncate`}>{order.id}</p>

                      <div className="mt-4 grid gap-2">
                        <p className="font-semibold">{product?.name || 'Product'}</p>
                        <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} text-sm`}>{store?.name || 'Store'}</p>
                        <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} text-sm`}>Pickup code: {order.pickupCode}</p>
                        <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} text-sm`}>
                          Status: <span className="font-semibold">{order.status}</span>
                        </p>
                      </div>

                      <div className="mt-5">
                        <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} text-xs mb-2`}>Pickup instructions</p>
                        <ul className={`${darkMode ? 'text-white/70' : 'text-gray-600'} text-sm list-disc pl-5 space-y-1`}>
                          <li>Go to the store pickup desk in the mall.</li>
                          <li>Show your QR code (or pickup code) to staff.</li>
                          <li>Confirm pickup to complete the order.</li>
                        </ul>
                      </div>

                      {order.status !== 'picked_up' ? (
                        <button
                          type="button"
                          onClick={() => confirmPickup(order.id)}
                          className="mt-6 px-4 py-3 rounded-2xl bg-green-500/90 hover:bg-green-500 text-white font-semibold"
                        >
                          Confirm pickup
                        </button>
                      ) : null}
                    </div>

                    <div className="flex-shrink-0">
                      <QrBlock value={`${order.id}:${order.pickupCode}`} />
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
