import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { useEcosystem } from '../../contexts/EcosystemContext'
import cmsDefaults from '../../data/cms.json'

const slugs = Object.keys(cmsDefaults)

export default function CmsPagesPage() {
  const { getCmsPage, upsertCmsPage } = useEcosystem()
  const [activeSlug, setActiveSlug] = useState(slugs[0] || 'about-us')

  const merged = useMemo(() => {
    const defaults = cmsDefaults[activeSlug] || { title: '', subtitle: '', content: '' }
    const custom = getCmsPage(activeSlug) || {}
    return { ...defaults, ...custom }
  }, [activeSlug, getCmsPage])

  const [draft, setDraft] = useState(merged)

  useEffect(() => {
    setDraft(merged)
  }, [merged])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CMS Pages</h1>
          <p className="mt-2 text-gray-600">Edit About, Terms, Privacy, and FAQ content.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">Pages</p>
            <div className="space-y-2">
              {slugs.map((slug) => (
                <button
                  key={slug}
                  type="button"
                  onClick={() => setActiveSlug(slug)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                    slug === activeSlug ? 'bg-navy text-white border-navy' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                  }`}
                >
                  <p className="font-semibold">{cmsDefaults[slug]?.title || slug}</p>
                  <p className={`text-xs ${slug === activeSlug ? 'text-white/80' : 'text-gray-500'}`}>/p/{slug}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-3">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-sm text-gray-500">Editing</p>
                <h2 className="text-xl font-bold text-gray-900">{activeSlug}</h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  upsertCmsPage(activeSlug, draft)
                }}
                className="px-4 py-2 rounded-lg bg-navy text-white font-semibold hover:bg-navy/90"
              >
                Save
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  value={draft.title || ''}
                  onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                <input
                  value={draft.subtitle || ''}
                  onChange={(e) => setDraft((p) => ({ ...p, subtitle: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={draft.content || ''}
                  onChange={(e) => setDraft((p) => ({ ...p, content: e.target.value }))}
                  rows={14}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-2">Tip: Use blank lines to separate paragraphs.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
