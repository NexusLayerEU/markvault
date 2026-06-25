import { clsx } from 'clsx'

const COLORS = [
  'bg-purple-100 text-purple-700',
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-amber-100 text-amber-700',
  'bg-pink-100 text-pink-700',
  'bg-cyan-100 text-cyan-700',
]

function tagColor(tag: string) {
  let hash = 0
  for (let i = 0; i < tag.length; i++) hash = tag.charCodeAt(i) + ((hash << 5) - hash)
  return COLORS[Math.abs(hash) % COLORS.length]
}

export default function Badge({ tag, onClick, active }: { tag: string; onClick?: () => void; active?: boolean }) {
  return (
    <span
      onClick={onClick}
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-opacity',
        active ? tagColor(tag) : 'bg-mv-accent-dim text-mv-accent',
        onClick && 'hover:opacity-80'
      )}
    >
      {tag}
    </span>
  )
}
