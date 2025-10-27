'use client'
import AuthGate from '@/components/AuthGate'

export default function PostPage() {
  return (
    <AuthGate>
      <main className="min-h-[60vh] p-6 flex justify-center">
        <div className="w-full max-w-2xl bg-[#121A2E] text-white rounded-2xl p-6 space-y-4">
          <h1 className="text-xl font-semibold">Post a gig (coming soon)</h1>
          <p className="opacity-80 text-sm">You’re logged in. We’ll wire up the full gig form next.</p>
        </div>
      </main>
    </AuthGate>
  )
}
