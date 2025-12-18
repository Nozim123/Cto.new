import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useUser } from '../contexts/UserContext'
import { useEcosystem } from '../contexts/EcosystemContext'
import storesData from '../data/stores.json'

const emptyProduct = {
  name: '',
  category: '',
  price: 0,
  availability: 'In Stock',
  image: '',
  description: ''
}

export default function SellerDashboardPage() {
  const { darkMode } = useTheme()
  const { user, isAuthenticated } = useUser()
  const {
    state,
    requestSellerAccess,
    isSellerApprovedForStore,
    getProductsByStore,
    upsertProductOverride,
    createCustomProduct,
    deleteCustomProduct,
    updateReturn
  } = useEcosystem()

  const [selectedStoreId, setSelectedStoreId] = useState('')
  const [tab, setTab] = useState('products')
  const [newProduct, setNewProduct] = useState(emptyProduct)

  const myRequests = useMemo(() => {
    return (state.seller.requests || []).filter((r) => r.userId === (user?.id || 'guest'))
  }, [state.seller.requests, user])

  const approvedStoreIds = useMemo(() => {
    return state.seller.approvalsByUserId?.[user?.id || 'guest']?.storeIds || []
  }, [state.seller.approvalsByUserId, user])

  const approvedStores = useMemo(() => storesData.filter((s) => approvedStoreIds.includes(s.id)), [approvedStoreIds])

  const effectiveStoreId = selectedStoreId || approvedStoreIds[0] || ''

  const products = useMemo(() => getProductsByStore(effectiveStoreId), [getProductsByStore, effectiveStoreId])

  const storeReturns = useMemo(() => {
    if (!effectiveStoreId) return []
    return (state.returns.items || []).filter((r) => r.storeId === effectiveStoreId)
  }, [state.returns.items, effectiveStoreId])

  const canManage = effectiveStoreId && isSellerApprovedForStore(effectiveStoreId)

  if (!isAuthenticated || !user) {
    return (
      <div className={`min-h-screen pt-24 pb-24 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="max-w-3xl mx-auto px-4 lg:px-8">
          <div className={`p-8 rounded-3xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
            <h1 className="text-2xl font-bold mb-2">Seller Dashboard</h1>
            <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} mb-6`}>
              Please sign in to request store access.
            </p>
            <Link to="/" className="text-purple-400 hover:underline">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen pt-24 pb-24 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Seller / Store Dashboard</h1>
            <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} mt-1`}>
              Limited access, controlled by admin approval.
            </p>
          </div>
          <Link
            to="/account"
            className={`px-4 py-2 rounded-xl text-sm font-semibold border ${
              darkMode ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}
          >
            Account
          </Link>
        </div>

        {approvedStoreIds.length === 0 ? (
          <div className={`p-6 rounded-3xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
            <h2 className="text-lg font-semibold mb-2">Request access</h2>
            <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} text-sm mb-4`}>
              Choose a store to request owner access. Admin must approve before you can manage products.
            </p>

            <form
              className="flex flex-col sm:flex-row gap-3"
              onSubmit={(e) => {
                e.preventDefault()
                requestSellerAccess({ storeId: selectedStoreId })
              }}
            >
              <select
                value={selectedStoreId}
                onChange={(e) => setSelectedStoreId(e.target.value)}
                className={`flex-1 px-4 py-3 rounded-2xl border outline-none ${
                  darkMode ? 'bg-gray-900/40 border-white/10' : 'bg-white border-gray-200'
                }`}
                required
              >
                <option value="">Select store</option>
                {storesData.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold"
              >
                Request
              </button>
            </form>

            {myRequests.length > 0 ? (
              <div className="mt-6">
                <p className="text-sm font-semibold mb-2">Your requests</p>
                <div className="grid gap-2">
                  {myRequests.map((r) => (
                    <div
                      key={r.id}
                      className={`p-4 rounded-2xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold truncate">{r.storeName}</p>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            r.status === 'approved'
                              ? 'bg-green-500/20 text-green-300'
                              : r.status === 'rejected'
                                ? 'bg-red-500/20 text-red-300'
                                : 'bg-yellow-500/20 text-yellow-300'
                          }`}
                        >
                          {r.status}
                        </span>
                      </div>
                      <p className={`${darkMode ? 'text-white/60' : 'text-gray-600'} text-xs mt-1`}>{r.id}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`p-4 rounded-3xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <select
                    value={effectiveStoreId}
                    onChange={(e) => setSelectedStoreId(e.target.value)}
                    className={`px-4 py-3 rounded-2xl border outline-none ${
                      darkMode ? 'bg-gray-900/40 border-white/10' : 'bg-white border-gray-200'
                    }`}
                  >
                    {approvedStores.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-2">
                    {['products', 'returns'].map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setTab(key)}
                        className={`px-4 py-2 rounded-2xl text-sm font-semibold border transition-colors ${
                          tab === key
                            ? 'bg-purple-600 text-white border-purple-600'
                            : darkMode
                              ? 'border-white/10 bg-white/5 hover:bg-white/10'
                              : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        {key === 'products' ? 'Products' : 'Returns'}
                      </button>
                    ))}
                  </div>
                </div>

                <p className={`${darkMode ? 'text-white/60' : 'text-gray-600'} text-sm`}>
                  Access: <span className="font-semibold">Approved</span>
                </p>
              </div>
            </div>

            {tab === 'products' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className={`p-6 rounded-3xl border lg:col-span-2 ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
                  <h2 className="text-lg font-semibold mb-4">Manage products</h2>
                  {!canManage ? (
                    <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'}`}>Select an approved store.</p>
                  ) : (
                    <div className="grid gap-3">
                      {products.map((p) => (
                        <div
                          key={p.id}
                          className={`p-4 rounded-2xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-semibold truncate">{p.name}</p>
                              <p className={`${darkMode ? 'text-white/60' : 'text-gray-600'} text-xs truncate`}>
                                {p.category} • ${Number(p.price).toFixed(2)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {p.createdAt ? (
                                <button
                                  type="button"
                                  onClick={() => deleteCustomProduct(p.id)}
                                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-red-500/90 hover:bg-red-500 text-white"
                                >
                                  Delete
                                </button>
                              ) : null}
                            </div>
                          </div>

                          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                            <input
                              defaultValue={p.price}
                              type="number"
                              step="0.01"
                              min="0"
                              className={`px-3 py-2 rounded-xl border outline-none ${
                                darkMode ? 'bg-gray-900/40 border-white/10' : 'bg-white border-gray-200'
                              }`}
                              onBlur={(e) => upsertProductOverride(p.id, { price: Number(e.target.value || 0) })}
                            />
                            <select
                              defaultValue={p.availability || 'In Stock'}
                              className={`px-3 py-2 rounded-xl border outline-none ${
                                darkMode ? 'bg-gray-900/40 border-white/10' : 'bg-white border-gray-200'
                              }`}
                              onChange={(e) => upsertProductOverride(p.id, { availability: e.target.value })}
                            >
                              <option value="In Stock">In Stock</option>
                              <option value="Out of Stock">Out of Stock</option>
                            </select>
                            <input
                              defaultValue={p.image}
                              placeholder="Image URL"
                              className={`px-3 py-2 rounded-xl border outline-none ${
                                darkMode ? 'bg-gray-900/40 border-white/10' : 'bg-white border-gray-200'
                              }`}
                              onBlur={(e) => upsertProductOverride(p.id, { image: e.target.value })}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={`p-6 rounded-3xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
                  <h2 className="text-lg font-semibold mb-4">Add product</h2>
                  <form
                    className="space-y-3"
                    onSubmit={(e) => {
                      e.preventDefault()
                      if (!canManage) return
                      createCustomProduct({
                        ...newProduct,
                        storeId: effectiveStoreId,
                        price: Number(newProduct.price || 0)
                      })
                      setNewProduct(emptyProduct)
                    }}
                  >
                    {['name', 'category', 'image'].map((key) => (
                      <input
                        key={key}
                        value={newProduct[key]}
                        onChange={(e) => setNewProduct((p) => ({ ...p, [key]: e.target.value }))}
                        placeholder={key === 'image' ? 'Image URL' : key[0].toUpperCase() + key.slice(1)}
                        className={`w-full px-4 py-3 rounded-2xl border outline-none ${
                          darkMode ? 'bg-gray-900/40 border-white/10' : 'bg-white border-gray-200'
                        }`}
                        required={key !== 'image'}
                      />
                    ))}

                    <input
                      value={newProduct.price}
                      onChange={(e) => setNewProduct((p) => ({ ...p, price: e.target.value }))}
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Price"
                      className={`w-full px-4 py-3 rounded-2xl border outline-none ${
                        darkMode ? 'bg-gray-900/40 border-white/10' : 'bg-white border-gray-200'
                      }`}
                      required
                    />

                    <select
                      value={newProduct.availability}
                      onChange={(e) => setNewProduct((p) => ({ ...p, availability: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-2xl border outline-none ${
                        darkMode ? 'bg-gray-900/40 border-white/10' : 'bg-white border-gray-200'
                      }`}
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>

                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct((p) => ({ ...p, description: e.target.value }))}
                      rows={4}
                      placeholder="Description"
                      className={`w-full px-4 py-3 rounded-2xl border outline-none ${
                        darkMode ? 'bg-gray-900/40 border-white/10' : 'bg-white border-gray-200'
                      }`}
                    />

                    <button
                      type="submit"
                      className={`w-full px-4 py-3 rounded-2xl font-semibold ${
                        canManage
                          ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white'
                          : 'bg-gray-400 text-white cursor-not-allowed'
                      }`}
                      disabled={!canManage}
                    >
                      Create
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className={`p-6 rounded-3xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
                <h2 className="text-lg font-semibold mb-4">Return requests</h2>
                {storeReturns.length === 0 ? (
                  <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'}`}>No return requests for this store.</p>
                ) : (
                  <div className="grid gap-3">
                    {storeReturns.map((r) => (
                      <div
                        key={r.id}
                        className={`p-4 rounded-2xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold truncate">{r.id}</p>
                            <p className={`${darkMode ? 'text-white/60' : 'text-gray-600'} text-xs mt-1`}>Order: {r.orderId}</p>
                            <p className={`${darkMode ? 'text-white/60' : 'text-gray-600'} text-xs`}>Status: {r.status}</p>
                            {r.reason ? (
                              <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} text-sm mt-2`}>Reason: {r.reason}</p>
                            ) : null}
                          </div>
                          <select
                            value={r.status}
                            onChange={(e) => updateReturn(r.id, { status: e.target.value })}
                            className={`px-3 py-2 rounded-xl border outline-none ${
                              darkMode ? 'bg-gray-900/40 border-white/10' : 'bg-white border-gray-200'
                            }`}
                          >
                            <option value="requested">requested</option>
                            <option value="approved">approved</option>
                            <option value="rejected">rejected</option>
                          </select>
                        </div>
                        <textarea
                          defaultValue={r.storeMessage || ''}
                          rows={3}
                          placeholder="Store response message"
                          className={`mt-3 w-full px-3 py-2 rounded-xl border outline-none ${
                            darkMode ? 'bg-gray-900/40 border-white/10' : 'bg-white border-gray-200'
                          }`}
                          onBlur={(e) => updateReturn(r.id, { storeMessage: e.target.value })}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
