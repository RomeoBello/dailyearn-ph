'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

type Tab = 'login'|'signup'

export default function LoginPage() {
  const router = useRouter()
  const params = useSearchParams()
  const [tab, setTab] = useState<Tab>(params.get('signup') ? 'signup' : 'login')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string|null>(params.get('checkEmail') ? 'Check your email to verify your account, then log in.' : null)

  useEffect(() => {
    if (params.get('signup')) setTab('signup')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleLogin(form: FormData) {
    setLoading(true); setMsg(null)
    try {
      const email = String(form.get('email'))
      const password = String(form.get('password'))
      await signInWithEmailAndPassword(auth, email, password)
      router.replace(params.get('next') || '/profile/setup')
    } catch (e:any) {
      setMsg(e.message || 'Login failed')
    } finally { setLoading(false) }
  }

  async function handleSignup(form: FormData) {
    setLoading(true); setMsg(null)
    try {
      const first = String(form.get('firstName')||'').trim()
      const last = String(form.get('lastName')||'').trim()
      const email = String(form.get('email'))
      const password = String(form.get('password'))
      const u = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(u.user, { displayName: `${first} ${last}`.trim() })
      await setDoc(doc(db,'profiles', u.user.uid), {
        firstName: first, lastName: last, email, createdAt: serverTimestamp(), stage: 'created', emailVerified: false
      }, { merge: true })
      await sendEmailVerification(u.user)
      setMsg('Verification email sent. Please check your inbox, then log in.')
    } catch (e:any) {
      setMsg(e.message || 'Sign up failed')
    } finally { setLoading(false); setTab('login') }
  }

  return (
    <main className="min-h-[70vh] flex items-start justify-center p-6">
      <div className="w-full max-w-md bg-[#121A2E] text-white rounded-2xl p-6 space-y-5">
        <div className="flex gap-2">
          <button onClick={()=>setTab('login')} className={tab==='login'?'px-3 py-2 rounded bg-white text-black':'px-3 py-2 rounded bg-black/20'}>Log in</button>
          <button onClick={()=>setTab('signup')} className={tab==='signup'?'px-3 py-2 rounded bg-white text-black':'px-3 py-2 rounded bg-black/20'}>Sign up</button>
        </div>

        {msg && <div className="p-3 rounded bg-black/40 text-sm">{msg}</div>}

        {tab==='login' ? (
          <form action={handleLogin} className="space-y-3">
            <div>
              <label className="text-sm">Email</label>
              <input name="email" type="email" required className="w-full mt-1 bg-black/20 rounded px-3 py-2"/>
            </div>
            <div>
              <label className="text-sm">Password</label>
              <input name="password" type="password" required className="w-full mt-1 bg-black/20 rounded px-3 py-2"/>
            </div>
            <button disabled={loading} className="w-full mt-2 bg-white text-black rounded py-2">
              {loading?'Please wait…':'Log in'}
            </button>
            <p className="text-xs mt-2 opacity-70">New here? <button type="button" onClick={()=>setTab('signup')} className="underline">Create an account</button></p>
          </form>
        ) : (
          <form action={handleSignup} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-sm">First name</label><input name="firstName" required className="w-full mt-1 bg-black/20 rounded px-3 py-2"/></div>
              <div><label className="text-sm">Last name</label><input name="lastName" required className="w-full mt-1 bg-black/20 rounded px-3 py-2"/></div>
            </div>
            <div>
              <label className="text-sm">Email</label>
              <input name="email" type="email" required className="w-full mt-1 bg-black/20 rounded px-3 py-2"/>
            </div>
            <div>
              <label className="text-sm">Password</label>
              <input name="password" type="password" minLength={6} required className="w-full mt-1 bg-black/20 rounded px-3 py-2"/>
            </div>
            <button disabled={loading} className="w-full mt-2 bg-white text-black rounded py-2">
              {loading?'Please wait…':'Create account'}
            </button>
            <p className="text-xs mt-2 opacity-70">By signing up you agree to our basic terms. We’ll show full terms on first login.</p>
          </form>
        )}
      </div>
    </main>
  )
}
