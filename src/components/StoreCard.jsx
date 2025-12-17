import { Link } from 'react-router-dom'
import Button3D from './Button3D'
import ShareComponent from './ShareComponent'
import { useLanguage } from '../contexts/LanguageContext'

export default function StoreCard({ store, mallId }) {
  const { t } = useLanguage()
  const statusColor = store.status === 'open' ? 'text-green-400' : 'text-yellow-400'
  const statusText = store.status === 'open' ? t('common.open') : t('common.comingSoon')

  return (
    <div className="group relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-gold/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl flex flex-col h-full">
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={store.image || store.interiorImage}
          alt={store.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        
        {/* Logo overlay */}
        <div className="absolute bottom-4 left-4 w-12 h-12 bg-white rounded-lg p-1 shadow-lg">
          <img 
            src={store.logo} 
            alt="logo" 
            className="w-full h-full object-contain"
          />
        </div>

        {/* Status Badge */}
        <div className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 ${statusColor}`}>
          {statusText}
        </div>

        {/* Share Button */}
        <div className="absolute top-4 left-4">
          <ShareComponent 
            type="store" 
            item={store} 
            mallId={mallId}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col">
        <div className="mb-4">
          <div className="text-xs text-gold font-bold uppercase tracking-wider mb-1">
            {store.category}
          </div>
          <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-gold transition-colors">
            {store.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>⭐ 4.8</span>
            <span>•</span>
            <span>{t('map.floor')} {store.floor}</span>
          </div>
        </div>
        
        <div className="mt-auto flex gap-2">
          <Link to={`/mall/${mallId}/store/${store.id}`} className="flex-1">
            <Button3D variant="primary" className="w-full text-sm py-2">
              {t('buttons.viewProducts')}
            </Button3D>
          </Link>
        </div>
      </div>
    </div>
  )
}
