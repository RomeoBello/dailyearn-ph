'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import ImageUploader from '@/components/ImageUploader'

const categories = [
  'Errands','Delivery','Cleaning','Repair','Tutoring','Cooking','Design','Writing','Virtual Assistant','Tech Support'
]

export default function PostGigPage() {
  const router = useRouter()
  const [uid, setUid] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string|null>(null)
  const [images, setImages] = useState<string[]>([])

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, (u)=>{
      if (!u) router.replace('/login?next=/post')
      else setUid(u.uid)
    })
    return ()=>unsub()
  },[router])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!uid) return
    setBusy(true); setMsg(null)

    try {
      const form = new FormData(e.currentTarget)

      const payload = {
        ownerUid: uid,
        title: String(form.get('title')||'').trim(),
        description: String(form.get('description')||'').trim(),
        category: String(form.get('category')||categories[0]),
        budget: Number(form.get('budget')||0),
        region: String(form.get('region')||''),
        province: String(form.get('province')||''),
        city: String(form.get('city')||''),
        barangay: String(form.get('barangay')||''),
        dueDate: String(form.get('dueDate')||''),
        images: [],
        status: 'open',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      if (!payload.title || !payload.description) throw new Error('Title and description are required')
      if (!payload.budget || payload.budget <= 0) throw new Error('Please set a valid budget')
      if (!payload.region || !payload.province || !payload.city) throw new Error('Please fill region, province and city')

      const ref = await addDoc(collection(db, 'gigs'), payload)
      if (images.length) await updateDoc(doc(db, 'gigs', ref.id), { images })

      setMsg('Gig posted! Redirecting…')
      setTimeout(()=>router.replace('/gigs'), 800)
    } catch (e:any) {
      setMsg(e.message || 'Failed to create gig')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="min-h-[80vh] p-6 flex justify-center">
      <form onSubmit={onSubmit} className="w-full max-w-3xl bg-[#121A2E] text-white rounded-2xl p-6 space-y-5">
        <h1 className="text-xl font-semibold">Post a gig</h1>
        {msg && <div className="p-3 rounded bg-black/40 text-sm">{msg}</div>}

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm">Title</label>
            <input name="title" required className="w-full mt-1 bg-black/20 rounded px-3 py-2" />
          </div>
          <div>
            <label className="text-sm">Category</label>
            <select name="category" className="w-full mt-1 bg-black/20 rounded px-3 py-2">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm">Description</label>
          <textarea name="description" required rows={5} className="w-full mt-1 bg-black/20 rounded px-3 py-2" />
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm">Budget (PHP)</label>
            <input name="budget" type="number" min="1" required className="w-full mt-1 bg-black/20 rounded px-3 py-2" />
          </div>
          <div>
            <label className="text-sm">Due date</label>
            <input name="dueDate" type="date" className="w-full mt-1 bg-black/20 rounded px-3 py-2" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm">Barangay (optional)</label>
            <input name="barangay" className="w-full mt-1 bg-black/20 rounded px-3 py-2" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div><label className="text-sm">Region</label><input name="region" required className="w-full mt-1 bg-black/20 rounded px-3 py-2" /></div>
          <div><label className="text-sm">Province</label><input name="province" required className="w-full mt-1 bg-black/20 rounded px-3 py-2" /></div>
          <div><label className="text-sm">City</label><input name="city" required className="w-full mt-1 bg-black/20 rounded px-3 py-2" /></div>
        </div>

        <div>
          <label className="text-sm">Photos</label>
          <ImageUploader gigId={'temp-'+Date.now()} onUploaded={(urls)=>setImages(urls)} />
        </div>

        <button disabled={busy} className="bg-white text-black rounded px-4 py-2">
          {busy ? 'Posting…' : 'Post gig'}
        </button>
      </form>
    </main>
  )
}
