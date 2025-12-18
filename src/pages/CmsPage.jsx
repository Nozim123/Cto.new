import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useEcosystem } from '../contexts/EcosystemContext'
import cmsDefaults from '../data/cms.json'

const normalizeSlug = (slug) => (slug || '').toLowerCase().replace(/[^a-z0-9-]/g, '')

const renderBlocks = (raw) => {
  if (!raw) return null
  return raw
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p, idx) => (
      <p key={idx} className="leading-relaxed">
        {p}
      </p>
    ))
}

export default function CmsPage() {
  const { slug } = useParams()
  const { darkMode } = useTheme()
  const { getCmsPage } = useEcosystem()

  const page = useMemo(() => {
    const key = normalizeSlug(slug)
    return getCmsPage(key) || cmsDefaults[key] || null
  }, [slug, getCmsPage])

  return (
    <div className={`min-h-screen pt-24 pb-24 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-3xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between gap-3 mb-8">
          <div>
            <h1 className="text-3xl font-bold">{page?.title || 'Page'}</h1>
            {page?.subtitle ? (
              <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} mt-1`}>{page.subtitle}</p>
            ) : null}
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

        <div className={`p-6 rounded-3xl border space-y-4 ${darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
          {page?.content ? renderBlocks(page.content) : <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'}`}>Not found.</p>}
        </div>
      </div>
    </div>
  )
}
