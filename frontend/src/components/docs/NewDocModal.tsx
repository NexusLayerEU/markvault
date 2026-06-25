import { useState } from 'react'
import Button from '../ui/Button'

interface Props {
  onSave: (title: string, content: string, tags: string[]) => Promise<void>
  onClose: () => void
}

export default function NewDocModal({ onSave, onClose }: Props) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tagsRaw, setTagsRaw] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) { setError('Title and content required'); return }
    setSaving(true)
    try {
      const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean)
      await onSave(title.trim(), content.trim(), tags)
      onClose()
    } catch {
      setError('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-mv-border flex items-center justify-between">
          <h2 className="font-semibold text-mv-text">New Document</h2>
          <button onClick={onClose} className="text-mv-text-muted hover:text-mv-text text-xl leading-none">×</button>
        </div>
        <form onSubmit={submit} className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 pt-4 flex flex-col gap-3">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Document title"
              className="w-full border border-mv-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-mv-accent"
            />
            <input
              value={tagsRaw}
              onChange={e => setTagsRaw(e.target.value)}
              placeholder="Tags (comma separated): api, architecture, notes"
              className="w-full border border-mv-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-mv-accent"
            />
          </div>
          <div className="flex-1 px-6 py-3 overflow-hidden flex flex-col gap-1 min-h-[300px]">
            <label className="text-xs text-mv-text-muted font-medium">Markdown content</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={"# Title\n\nYour markdown content here...\n\n```mermaid\ngraph TD\n  A --> B\n```"}
              className="flex-1 font-mono text-sm border border-mv-border rounded-lg px-3 py-2 focus:outline-none focus:border-mv-accent resize-none"
            />
          </div>
          <div className="px-6 py-4 border-t border-mv-border flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
            <Button loading={saving} type="submit">Save Document</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
