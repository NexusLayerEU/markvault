import { formatDistanceToNow } from 'date-fns'
import { clsx } from 'clsx'
import Badge from '../ui/Badge'
import type { DocSummary } from '../../types/api'

interface Props {
  docs: DocSummary[]
  selectedId: string | null
  onSelect: (id: string) => void
  loading: boolean
}

export default function DocList({ docs, selectedId, onSelect, loading }: Props) {
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full border-2 border-mv-border border-t-mv-accent w-6 h-6" />
      </div>
    )
  }

  if (!docs.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-mv-text-muted">
        <span className="text-4xl mb-3">📄</span>
        <p className="text-sm">No documents yet</p>
        <p className="text-xs mt-1">Push an MD file to get started</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {docs.map(doc => (
        <div
          key={doc.id}
          onClick={() => onSelect(doc.id)}
          className={clsx(
            'px-4 py-3 border-b border-mv-border cursor-pointer transition-colors',
            selectedId === doc.id
              ? 'bg-mv-accent-dim border-l-2 border-l-mv-accent'
              : 'hover:bg-mv-accent-dim/30'
          )}
        >
          <p className={clsx('text-sm font-medium truncate', selectedId === doc.id ? 'text-mv-accent' : 'text-mv-text')}>
            {doc.title}
          </p>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {doc.tags.slice(0, 3).map(tag => <Badge key={tag} tag={tag} active />)}
            {doc.tags.length > 3 && <span className="text-xs text-mv-text-muted">+{doc.tags.length - 3}</span>}
          </div>
          <p className="text-xs text-mv-text-light mt-1.5">
            {formatDistanceToNow(new Date(doc.updated_at), { addSuffix: true })} · {doc.pushed_by}
          </p>
        </div>
      ))}
    </div>
  )
}
