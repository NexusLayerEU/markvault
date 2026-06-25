const IDENTITY_SERVER_URL = import.meta.env.VITE_IDENTITY_SERVER_URL || 'http://192.168.68.111:3007'

export default function LoginPage() {
  const handleSso = () => {
    const redirect = encodeURIComponent(window.location.origin + "/app")
    window.location.href = `${IDENTITY_SERVER_URL}/login?redirect=${redirect}`
  }

  return (
    <div className="min-h-screen bg-mv-bg flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-sans text-3xl font-bold text-mv-text">
            Mark<span className="text-mv-accent">Vault</span>
          </h1>
          <p className="text-mv-text-muted text-sm mt-2">Your Markdown document store</p>
        </div>
        <div className="bg-white rounded-xl border border-mv-border p-6 shadow-sm">
          <button
            onClick={handleSso}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}
          >
            <span>🔐</span> Sign in with NexusLayer SSO
          </button>
        </div>
      </div>
    </div>
  )
}
