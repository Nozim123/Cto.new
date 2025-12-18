import AdminLayout from '../components/AdminLayout'
import { useTheme } from '../../contexts/ThemeContext'

const seasons = ['winter', 'spring', 'summer', 'autumn']

export default function SeasonEnginePage() {
  const { season, seasonMode, seasonOverride, setSeasonMode, setSeasonOverride } = useTheme()

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seasonal Experience Engine</h1>
          <p className="mt-2 text-gray-600">Auto season themes or admin-controlled overrides.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mode</label>
              <select
                value={seasonMode}
                onChange={(e) => setSeasonMode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              >
                <option value="auto">Auto (by date)</option>
                <option value="manual">Manual override</option>
              </select>
              <p className="text-xs text-gray-500 mt-2">Auto updates based on the current month.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Season</label>
              <select
                value={seasonOverride}
                onChange={(e) => setSeasonOverride(e.target.value)}
                disabled={seasonMode !== 'manual'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent disabled:opacity-50"
              >
                {seasons.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">Current active season: <span className="font-semibold">{season}</span></p>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg border border-gray-200 bg-gray-50">
            <p className="text-sm font-semibold text-gray-900 mb-1">What changes with seasons?</p>
            <p className="text-sm text-gray-600">
              Background animations (snow, blossoms, sun rays, leaves) and seasonal accent gradients.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
