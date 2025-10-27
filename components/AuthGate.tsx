'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.replace('/login?next=' + encodeURIComponent(window.location.pathname))
      else setReady(true)
    })
    return () => unsub()
  }, [router])

  if (!ready) return <div className="p-8 text-center text-gray-300">Checking session…</div>
  return <>{children}</>
}
