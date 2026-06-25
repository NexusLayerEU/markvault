import { clsx } from 'clsx'
import Badge from '../ui/Badge'
import { useAuthStore } from '../../store/authStore'

interface Props {
  allTags: string[]
  activeTags: string[]
  search: string
  onSearch: (v: string) => void
  onTagToggle: (tag: string) => void
  onNew: () => void
}

export default function Sidebar({ allTags, activeTags, search, onSearch, onTagToggle, onNew }: Props) {
  const user = useAuthStore(s => s.user)
  const clear = useAuthStore(s => s.clear)

  return (
    <div className="w-64 flex-shrink-0 bg-mv-sidebar flex flex-col h-full">
      <div className="p-4 border-b border-white/5">
        <h1 className="text-white font-bold text-lg">
          Mark<span className="text-mv-accent">Vault</span>
        </h1>
        <p className="text-white/40 text-xs mt-0.5">Markdown document store</p>
      </div>

      <div className="p-3">
        <input
          type="text"
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Search docs..."
          className="w-full bg-white/5 text-white placeholder-white/30 text-sm rounded-lg px-3 py-2 border border-white/10 focus:outline-none focus:border-mv-accent/50"
        />
      </div>

      <div className="px-3 mb-2">
        <button
          onClick={onNew}
          className="w-full flex items-center justify-center gap-2 bg-mv-accent hover:bg-purple-700 text-white text-sm font-medium rounded-lg py-2 transition-colors"
        >
          <span>+</span> New Doc
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2">
        {allTags.length > 0 && (
          <>
            <p className="text-white/30 text-xs uppercase tracking-wider mb-2">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map(tag => (
                <Badge
                  key={tag}
                  tag={tag}
                  active={activeTags.includes(tag)}
                  onClick={() => onTagToggle(tag)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-3 border-t border-white/5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-white/50 text-xs truncate max-w-[130px]">{user?.email}</span>
          <button onClick={clear} className="text-white/30 hover:text-white/60 text-xs flex-shrink-0 ml-1">out</button>
        </div>
        {(() => {
          const raw = localStorage.getItem('mv_token') || ''
          let tier = 'FREE'
          try { tier = JSON.parse(atob(raw.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')))?.tier || 'FREE' } catch {}
          const COLORS: Record<string,string> = {MAX:'#f59e0b',PRO:'#6366f1',FREE:'#64748b'}
          const c = COLORS[tier] || COLORS.FREE
          return <span style={{ background:c+'22', border:`1px solid ${c}44`, borderRadius:4, padding:'1px 6px', fontSize:10, fontWeight:700, color:c }}>{tier}</span>
        })()}
      </div>
    </div>
  )
}
