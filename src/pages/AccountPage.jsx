import { Link, Navigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useUser } from '../contexts/UserContext'
import mallsData from '../data/malls.json'
import storesData from '../data/stores.json'
import productsData from '../data/products.json'

const SectionTitle = ({ children }) => (
  <h2 className="text-lg font-semibold mb-4">{children}</h2>
)

const ItemRow = ({ title, subtitle, image, href }) => (
  <Link
    to={href}
    className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
  >
    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white/10 border border-white/10 flex-shrink-0">
      {image ? <img src={image} alt="" className="w-full h-full object-cover" loading="lazy" /> : null}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-white font-semibold truncate">{title}</p>
      {subtitle ? <p className="text-sm text-white/60 truncate">{subtitle}</p> : null}
    </div>
    <span className="text-white/40">→</span>
  </Link>
)

export default function AccountPage() {
  const { darkMode } = useTheme()
  const { t } = useLanguage()
  const { user, isAuthenticated, logout, favorites } = useUser()

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />
  }

  const favMalls = mallsData.filter((m) => favorites.malls.includes(m.id))
  const favStores = storesData.filter((s) => favorites.stores.includes(s.id))
  const favProducts = productsData.filter((p) => favorites.products.includes(p.id))

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-primary'} text-white`}>
      <div className="max-w-5xl mx-auto px-4 lg:px-8 pt-10 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {t('account.title') || 'My Account'}
            </h1>
            <p className="text-white/70">
              {t('account.subtitle') || 'Profile, favorites, and preferences'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-sm font-semibold"
            >
              {t('buttons.backToHome') || 'Back to Home'}
            </Link>
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 rounded-xl bg-red-500/80 hover:bg-red-500 border border-red-500/40 text-sm font-semibold"
            >
              {t('common.logout') || 'Logout'}
            </button>
          </div>
        </div>

        <div className="p-6 rounded-3xl border border-white/10 bg-white/5 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-xl">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <p className="text-white font-semibold text-lg">{user.name}</p>
              <p className="text-white/70 text-sm">{user.email}</p>
            </div>
          </div>
        </div>

        <SectionTitle>{t('account.favorites') || 'Favorites & Wishlist'}</SectionTitle>

        <div className="grid gap-8">
          <div>
            <h3 className="text-sm font-semibold text-white/80 mb-3">
              {t('search.malls') || 'Malls'} ({favMalls.length})
            </h3>
            <div className="grid gap-3">
              {favMalls.length > 0 ? (
                favMalls.map((mall) => (
                  <ItemRow
                    key={mall.id}
                    title={mall.name}
                    subtitle={mall.location}
                    image={mall.image}
                    href={`/mall/${mall.id}`}
                  />
                ))
              ) : (
                <p className="text-sm text-white/60">
                  {t('account.noFavMalls') || 'No favorite malls yet.'}
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white/80 mb-3">
              {t('search.stores') || 'Stores'} ({favStores.length})
            </h3>
            <div className="grid gap-3">
              {favStores.length > 0 ? (
                favStores.map((store) => (
                  <ItemRow
                    key={store.id}
                    title={store.name}
                    subtitle={`${store.category} • ${t('map.floor') || 'Floor'} ${store.floor}`}
                    image={store.logo || store.image}
                    href={`/mall/${store.mallId}/store/${store.id}`}
                  />
                ))
              ) : (
                <p className="text-sm text-white/60">
                  {t('account.noFavStores') || 'No favorite stores yet.'}
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white/80 mb-3">
              {t('search.products') || 'Products'} ({favProducts.length})
            </h3>
            <div className="grid gap-3">
              {favProducts.length > 0 ? (
                favProducts.map((product) => (
                  <ItemRow
                    key={product.id}
                    title={product.name}
                    subtitle={product.category}
                    image={product.image}
                    href={`/product/${product.id}`}
                  />
                ))
              ) : (
                <p className="text-sm text-white/60">
                  {t('account.noFavProducts') || 'No saved products yet.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
