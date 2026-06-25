import { clsx } from 'clsx'
import Spinner from './Spinner'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
}

export default function Button({ loading, variant = 'primary', size = 'md', className, children, ...props }: Props) {
  return (
    <button
      disabled={loading || props.disabled}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors disabled:opacity-50',
        size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm',
        variant === 'primary' && 'bg-mv-accent text-white hover:bg-purple-700',
        variant === 'ghost' && 'text-mv-text-muted hover:text-mv-text hover:bg-mv-accent-dim',
        variant === 'danger' && 'text-red-600 hover:bg-red-50',
        className
      )}
      {...props}
    >
      {loading && <Spinner size={4} />}
      {children}
    </button>
  )
}
