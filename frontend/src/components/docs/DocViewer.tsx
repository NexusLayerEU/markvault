import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import type { Doc } from '../../types/api'
import { formatDistanceToNow } from 'date-fns'

interface Props {
  doc: Doc | null
  loading: boolean
  onDelete?: (id: string) => void
}

function MermaidBlock({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!ref.current) return
    import('mermaid').then(m => {
      m.default.initialize({ startOnLoad: false, theme: 'default' })
      const id = `mermaid-${Math.random().toString(36).slice(2)}`
      m.default.render(id, code)
        .then(({ svg }) => { if (ref.current) ref.current.innerHTML = svg })
        .catch(e => setError(String(e)))
    })
  }, [code])

  if (error) return <pre className="text-red-500 text-xs p-3 bg-red-50 rounded">{error}</pre>
  return <div ref={ref} className="mermaid-container my-4 flex justify-center" />
}

function CodeBlock({ className, children }: { className?: string; children: React.ReactNode }) {
  const lang = /language-(\w+)/.exec(className || '')?.[1] ?? ''
  const code = String(children).trim()
  if (lang === 'mermaid') return <MermaidBlock code={code} />
  return <code className={className}>{children}</code>
}

export default function DocViewer({ doc, loading, onDelete }: Props) {
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full border-2 border-mv-border border-t-mv-accent w-6 h-6" />
      </div>
    )
  }

  if (!doc) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-mv-text-muted">
        <span className="text-5xl mb-4">📝</span>
        <p className="text-sm font-medium">Select a document to view it</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="sticky top-0 bg-mv-bg/90 backdrop-blur border-b border-mv-border px-8 py-4 flex items-start justify-between gap-4 z-10">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-mv-text truncate">{doc.title}</h1>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {doc.tags.map(tag => <Badge key={tag} tag={tag} active />)}
          </div>
          <p className="text-xs text-mv-text-muted mt-2">
            Pushed by {doc.pushed_by} · {formatDistanceToNow(new Date(doc.updated_at), { addSuffix: true })}
          </p>
        </div>
        {onDelete && (
          <Button variant="danger" size="sm" onClick={() => onDelete(doc.id)}>Delete</Button>
        )}
      </div>

      <div className="px-8 py-6 max-w-4xl">
        <div className="prose prose-sm max-w-none text-mv-text">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{ code: CodeBlock as any }}
          >
            {doc.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
