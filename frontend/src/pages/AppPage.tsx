import { useCallback, useEffect, useState } from 'react'
import Sidebar from '../components/layout/Sidebar'
import DocList from '../components/docs/DocList'
import DocViewer from '../components/docs/DocViewer'
import NewDocModal from '../components/docs/NewDocModal'
import { docsApi } from '../api/docs'
import type { Doc, DocSummary } from '../types/api'

export default function AppPage() {
  const [docs, setDocs] = useState<DocSummary[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null)
  const [listLoading, setListLoading] = useState(true)
  const [docLoading, setDocLoading] = useState(false)
  const [showNew, setShowNew] = useState(false)

  const loadDocs = useCallback(async () => {
    setListLoading(true)
    try {
      const [docsRes, tagsRes] = await Promise.all([
        docsApi.list(search, activeTags),
        docsApi.tags(),
      ])
      setDocs(docsRes.data)
      setAllTags(tagsRes.data)
    } finally {
      setListLoading(false)
    }
  }, [search, activeTags])

  useEffect(() => { loadDocs() }, [loadDocs])

  const selectDoc = async (id: string) => {
    setSelectedId(id)
    setDocLoading(true)
    try {
      const { data } = await docsApi.get(id)
      setSelectedDoc(data)
    } finally {
      setDocLoading(false)
    }
  }

  const tagToggle = (tag: string) => {
    setActiveTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const saveNew = async (title: string, content: string, tags: string[]) => {
    await docsApi.create({ title, content, tags })
    await loadDocs()
  }

  const deleteDoc = async (id: string) => {
    if (!confirm('Delete this document?')) return
    await docsApi.delete(id)
    setSelectedId(null)
    setSelectedDoc(null)
    await loadDocs()
  }

  return (
    <div className="flex h-screen overflow-hidden bg-mv-bg">
      <Sidebar
        allTags={allTags}
        activeTags={activeTags}
        search={search}
        onSearch={setSearch}
        onTagToggle={tagToggle}
        onNew={() => setShowNew(true)}
      />

      <div className="w-72 flex-shrink-0 border-r border-mv-border flex flex-col">
        <div className="px-4 py-3 border-b border-mv-border">
          <p className="text-xs text-mv-text-muted font-medium">
            {docs.length} document{docs.length !== 1 ? 's' : ''}
            {activeTags.length > 0 && ` · ${activeTags.length} tag filter${activeTags.length > 1 ? 's' : ''}`}
          </p>
        </div>
        <DocList
          docs={docs}
          selectedId={selectedId}
          onSelect={selectDoc}
          loading={listLoading}
        />
      </div>

      <DocViewer
        doc={selectedDoc}
        loading={docLoading}
        onDelete={deleteDoc}
      />

      {showNew && (
        <NewDocModal
          onSave={saveNew}
          onClose={() => setShowNew(false)}
        />
      )}
    </div>
  )
}
