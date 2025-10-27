'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import AuthGate from '@/components/AuthGate'

type Payout = 'gcash'|'maya'|'bank'

export default function ProfileSetupPage() {
  return (
    <AuthGate>
      <SetupForm />
    </AuthGate>
  )
}

function SetupForm() {
  const router = useRouter()
  const [uid, setUid] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string|null>(null)
  const [payout, setPayout] = useState<Payout>('gcash')

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, async (u)=>{
      if (u) {
        setUid(u.uid)
        const snap = await getDoc(doc(db,'profiles', u.uid))
        if (snap.exists() && snap.data()?.stage === 'complete') {
          router.replace('/post')
        }
      }
    })
    return ()=>unsub()
  },[router])

  async function save(form: FormData){
    if (!uid) return
    setSaving(true); setMsg(null)
    try {
      const payload:any = {
        firstName: String(form.get('firstName')||'').trim(),
        lastName: String(form.get('lastName')||'').trim(),
        phone: String(form.get('phone')||'').trim(),
        addressLine: String(form.get('addressLine')||'').trim(),
        region: String(form.get('region')||'').trim(),
        province: String(form.get('province')||'').trim(),
        city: String(form.get('city')||'').trim(),
        barangay: String(form.get('barangay')||'').trim(),
        payoutMethod: payout,
        updatedAt: serverTimestamp(),
        stage: 'complete'
      }
      if (payout === 'bank') {
        payload.bank = {
          bankName: String(form.get('bankName')||''),
          accountName: String(form.get('bankAccountName')||''),
          accountNumber: String(form.get('bankAccountNumber')||''),
        }
      } else {
        payload.wallet = {
          provider: payout,
          accountName: String(form.get('walletName')||''),
          number: String(form.get('walletNumber')||''),
        }
      }
      await setDoc(doc(db,'profiles', uid), payload, { merge: true })
      setMsg('Saved! Redirecting to Post a Gig…')
      setTimeout(()=>router.replace('/post'), 800)
    } catch (e:any) {
      setMsg(e.message || 'Save failed')
    } finally { setSaving(false) }
  }

  return (
    <main className="min-h-[80vh] p-6 flex justify-center">
      <form action={save} className="w-full max-w-2xl bg-[#121A2E] text-white rounded-2xl p-6 space-y-4">
        <h1 className="text-xl font-semibold">Complete your profile</h1>

        {msg && <div className="p-3 bg-black/40 rounded text-sm">{msg}</div>}

        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="text-sm">First name</label><input name="firstName" required className="w-full mt-1 bg-black/20 rounded px-3 py-2"/></div>
          <div><label className="text-sm">Last name</label><input name="lastName" required className="w-full mt-1 bg-black/20 rounded px-3 py-2"/></div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="text-sm">Phone</label><input name="phone" required className="w-full mt-1 bg-black/20 rounded px-3 py-2"/></div>
          <div><label className="text-sm">Address line</label><input name="addressLine" required className="w-full mt-1 bg-black/20 rounded px-3 py-2"/></div>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          <div><label className="text-sm">Region</label><input name="region" required className="w-full mt-1 bg-black/20 rounded px-3 py-2"/></div>
          <div><label className="text-sm">Province</label><input name="province" required className="w-full mt-1 bg-black/20 rounded px-3 py-2"/></div>
          <div><label className="text-sm">City</label><input name="city" required className="w-full mt-1 bg-black/20 rounded px-3 py-2"/></div>
          <div><label className="text-sm">Barangay</label><input name="barangay" className="w-full mt-1 bg-black/20 rounded px-3 py-2"/></div>
        </div>

        <div className="space-y-2">
          <div className="text-sm">Payout method</div>
          <div className="flex gap-3 text-sm">
            {(['gcash','maya','bank'] as Payout[]).map(p => (
              <label key={p} className={"px-3 py-2 rounded cursor-pointer " + (payout===p?'bg-white text-black':'bg-black/20')}>
                <input type="radio" name="payout" value={p} className="mr-2" checked={payout===p} onChange={()=>setPayout(p)}/>
                {p.upper() if False else ''}
              </label>
            ))}
          </div>
          {payout!=='bank' ? (
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="text-sm">Account name</label><input name="walletName" required className="w-full mt-1 bg-black/20 rounded px-3 py-2"/></div>
              <div><label className="text-sm">GCash/Maya number</label><input name="walletNumber" required className="w-full mt-1 bg-black/20 rounded px-3 py-2"/></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              <div><label className="text-sm">Bank name</label><input name="bankName" required className="w-full mt-1 bg-black/20 rounded px-3 py-2"/></div>
              <div><label className="text-sm">Account name</label><input name="bankAccountName" required className="w-full mt-1 bg-black/20 rounded px-3 py-2"/></div>
              <div><label className="text-sm">Account number</label><input name="bankAccountNumber" required className="w-full mt-1 bg-black/20 rounded px-3 py-2"/></div>
            </div>
          )}
        </div>

        <button disabled={saving} className="bg-white text-black rounded px-4 py-2">
          {saving?'Saving…':'Save & continue'}
        </button>
      </form>
    </main>
  )
}
