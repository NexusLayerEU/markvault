export default function Spinner({ size = 6 }: { size?: number }) {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-mv-border border-t-mv-accent w-${size} h-${size}`}
    />
  )
}
