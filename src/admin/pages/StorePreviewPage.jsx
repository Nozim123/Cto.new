import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  Building2,
  Calendar,
  Clock,
  ExternalLink,
  Phone,
  Store as StoreIcon,
  Tag
} from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import { mallAPI, storeAPI } from '../../services/api'

export default function StorePreviewPage() {
  const { id } = useParams()
  const [store, setStore] = useState(null)
  const [mall, setMall] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const storeResponse = await storeAPI.getById(id)
        const storeData = storeResponse.data
        setStore(storeData)

        if (storeData?.mall_id) {
          try {
            const mallResponse = await mallAPI.getById(storeData.mall_id)
            setMall(mallResponse.data)
          } catch (error) {
            console.error('Failed to fetch mall for store:', error)
          }
        }
      } catch (error) {
        console.error('Failed to fetch store:', error)
        toast.error('Do‘kon ma’lumotlarini yuklashda xato')
      } finally {
        setLoading(false)
      }
    }

    fetchStore()
  }, [id])

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy" />
        </div>
      </AdminLayout>
    )
  }

  if (!store) {
    return (
      <AdminLayout>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <StoreIcon className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Do‘kon topilmadi</h1>
          <p className="text-gray-600 mb-6">So‘ralgan do‘kon mavjud emas yoki o‘chirib yuborilgan.</p>
          <Link to="/admin/stores" className="bg-navy text-white px-6 py-3 rounded-lg hover:bg-navy/90">
            Orqaga
          </Link>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{store.name}</h1>
            <p className="mt-2 text-gray-600">Do‘kon tafsilotlari (preview)</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/admin/stores/${store.id}/edit`}
              className="bg-gold text-navy px-4 py-2 rounded-lg hover:bg-gold/90 font-medium"
            >
              Tahrirlash
            </Link>
            <Link
              to="/admin/stores"
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Ro‘yxatga qaytish
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="relative">
            <img
              src={store.banner}
              alt={store.name}
              className="w-full h-72 object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200'
              }}
            />
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {store.description_full ? (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Tavsif</h2>
                    <p className="text-gray-700 leading-relaxed">{store.description_full}</p>
                  </div>
                ) : null}

                {Array.isArray(store.gallery) && store.gallery.length > 0 ? (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Galereya</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {store.gallery.map((url, idx) => (
                        <img
                          key={`${url}-${idx}`}
                          src={url}
                          alt={`${store.name} gallery ${idx + 1}`}
                          className="w-full h-28 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="space-y-3">
                <div className="border border-gray-100 rounded-xl p-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Asosiy ma’lumotlar</h2>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <Building2 className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span>{mall?.name || 'Mall: noma’lum'}</span>
                    </div>

                    {store.category ? (
                      <div className="flex items-start gap-2">
                        <Tag className="w-4 h-4 text-gray-400 mt-0.5" />
                        <span>{store.category}</span>
                      </div>
                    ) : null}

                    {store.work_time ? (
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                        <span>{store.work_time}</span>
                      </div>
                    ) : null}

                    {store.opened_date ? (
                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                        <span>Ochilgan: {new Date(store.opened_date).toLocaleDateString('uz-UZ')}</span>
                      </div>
                    ) : null}

                    {store.phone ? (
                      <div className="flex items-start gap-2">
                        <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                        <span>{store.phone}</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {store.social ? (
                  <div className="border border-gray-100 rounded-xl p-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Ijtimoiy havolalar</h2>
                    <div className="space-y-2">
                      {Object.entries(store.social)
                        .filter(([, url]) => Boolean(url))
                        .map(([key, url]) => (
                          <a
                            key={key}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-navy hover:text-gold font-medium inline-flex items-center gap-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                            {key}
                          </a>
                        ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
