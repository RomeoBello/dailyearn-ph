'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { auth } from '@/lib/firebase'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from 'firebase/auth'

export default function LoginPage(){
  const [tab, setTab] = useState<'login'|'signup'>('login')
  const [msg, setMsg] = useState<string|null>(null)
  const [busy, setBusy] = useState(false)
  const router = useRouter()
  const next = useSearchParams().get('next') || '/'

  async function doLogin(form: FormData){
    setBusy(true); setMsg(null)
    try{
      const email = String(form.get('email')||'')
      const pass  = String(form.get('password')||'')
      const { user } = await signInWithEmailAndPassword(auth, email, pass)
      if (!user.emailVerified) return setMsg('Please verify your email, then log in again.')
      router.replace(next)
    }catch(e:any){ setMsg(e.message||'Login failed') } finally{ setBusy(false) }
  }

  async function doSignup(form: FormData){
    setBusy(true); setMsg(null)
    try{
      const email = String(form.get('email')||'')
      const pass  = String(form.get('password')||'')
      const { user } = await createUserWithEmailAndPassword(auth, email, pass)
      await sendEmailVerification(user)
      setMsg('Verification email sent. Please verify, then log in.')
      setTab('login')
    }catch(e:any){ setMsg(e.message||'Signup failed') } finally{ setBusy(false) }
  }

  return (
    <main className="min-h-[80vh] p-6 flex justify-center">
      <div className="w-full max-w-lg bg-[#121A2E] text-white rounded-2xl p-6 space-y-5">
        <div className="flex gap-4">
          <button className={tab==='login'?'font-semibold':''} onClick={()=>setTab('login')}>Login</button>
          <button className={tab==='signup'?'font-semibold':''} onClick={()=>setTab('signup')}>Sign up</button>
        </div>

        {msg && <div className="p-3 rounded bg-black/40 text-sm">{msg}</div>}

        {tab==='login' ? (
          <form action={doLogin} className="space-y-3">
            <div><label className="text-sm">Email</label><input name="email" type="email" required className="w-full mt-1 bg-black/20 rounded px-3 py-2"/></div>
            <div><label className="text-sm">Password</label><input name="password" type="password" required className="w-full mt-1 bg-black/20 rounded px-3 py-2"/></div>
            <button disabled={busy} className="bg-white text-black rounded px-4 py-2">{busy?'Logging in…':'Log in'}</button>
          </form>
        ) : (
          <form action={doSignup} className="space-y-3">
            <div><label className="text-sm">Email</label><input name="email" type="email" required className="w-full mt-1 bg-black/20 rounded px-3 py-2"/></div>
            <div><label className="text-sm">Password</label><input name="password" type="password" minLength={6} required className="w-full mt-1 bg-black/20 rounded px-3 py-2"/></div>
            <button disabled={busy} className="bg-white text-black rounded px-4 py-2">{busy?'Creating…':'Create account'}</button>
          </form>
        )}
      </div>
    </main>
  )
}
