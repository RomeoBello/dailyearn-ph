'use client'
import Protected from '@/components/Protected'
import { db, auth } from '@/lib/firebase'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { getBrowserLocation } from '@/lib/geo'

export default function NewGig(){
  const r = useRouter()
  const [form, setForm] = useState({ title:'', description:'', budget:'', currency:'PHP',
    region:'', province:'', city:'', barangay:'', requiresInPerson:true, category:'Errands',
    lat:'', lng:'' })
  const [loading, setLoading] = useState(false)
  const feeRate = 0.05

  async function useMyLoc(){
    try {
      const loc = await getBrowserLocation()
      setForm({ ...form, lat: String(loc.lat), lng: String(loc.lng) })
    } catch(e:any){
      alert('Could not get location: ' + e.message)
    }
  }

  async function submit(e:any){
    e.preventDefault()
    setLoading(true)
    const user = auth.currentUser
    if (!user) return
    const payload:any = {
      title: form.title,
      description: form.description,
      budget: Number(form.budget||0),
      currency: form.currency || 'PHP',
      location: {
        country: 'PH',
        region: form.region, province: form.province, city: form.city, barangay: form.barangay,
        lat: form.lat ? Number(form.lat) : null,
        lng: form.lng ? Number(form.lng) : null
      },
      category: form.category,
      posterUid: user.uid,
      status: 'open',
      requiresInPerson: form.requiresInPerson,
      createdAt: serverTimestamp()
    }
    await addDoc(collection(db,'gigs'), payload)
    r.push('/gigs')
  }

  return (
    <Protected>
      <div className='max-w-2xl mx-auto card'>
        <h1 className='text-xl font-bold mb-2'>Post a gig (Philippines)</h1>
        <form onSubmit={submit} className='grid gap-3'>
          <div className='grid md:grid-cols-2 gap-2'>
            <div>
              <label className='label'>Title</label>
              <input className='input' required value={form.title} onChange={e=>setForm({...form, title:e.target.value})}/>
            </div>
            <div>
              <label className='label'>Category</label>
              <select className='input' value={form.category} onChange={e=>setForm({...form, category:e.target.value})}>
                <option>Errands</option><option>House Help</option><option>Digital</option><option>Tutoring</option><option>Delivery</option>
              </select>
            </div>
          </div>

          <div>
            <label className='label'>Description</label>
            <textarea className='input h-28' required value={form.description as any} onChange={e=>setForm({...form, description:e.target.value})}/>
          </div>

          <div className='grid md:grid-cols-4 gap-2'>
            <div>
              <label className='label'>Budget</label>
              <input className='input' type='number' min='10' required value={form.budget} onChange={e=>setForm({...form, budget:e.target.value})}/>
            </div>
            <div>
              <label className='label'>Currency</label>
              <select className='input' value={form.currency} onChange={e=>setForm({...form, currency:e.target.value})}>
                <option>PHP</option><option>USD</option><option>CAD</option>
              </select>
            </div>
            <div>
              <label className='label'>Requires in-person</label>
              <select className='input' value={String(form.requiresInPerson)} onChange={e=>setForm({...form, requiresInPerson: e.target.value==='true'})}>
                <option value='true'>Yes</option><option value='false'>No (online)</option>
              </select>
            </div>
            <div className='flex items-end'><div className='text-sm opacity-80'>Fee preview: {(Number(form.budget||0)*feeRate).toFixed(2)} {form.currency}</div></div>
          </div>

          <div className='grid md:grid-cols-4 gap-2'>
            <div><label className='label'>Region</label><input className='input' placeholder='Region I' value={form.region} onChange={e=>setForm({...form, region:e.target.value})}/></div>
            <div><label className='label'>Province</label><input className='input' placeholder='Pangasinan' value={form.province} onChange={e=>setForm({...form, province:e.target.value})}/></div>
            <div><label className='label'>City/Municipality</label><input className='input' placeholder='Urdaneta' value={form.city} onChange={e=>setForm({...form, city:e.target.value})}/></div>
            <div><label className='label'>Barangay (optional)</label><input className='input' placeholder='Barangay' value={form.barangay} onChange={e=>setForm({...form, barangay:e.target.value})}/></div>
          </div>

          <div className='grid md:grid-cols-3 gap-2'>
            <div><label className='label'>Latitude (opt)</label><input className='input' placeholder='15.975' value={form.lat} onChange={e=>setForm({...form, lat:e.target.value})}/></div>
            <div><label className='label'>Longitude (opt)</label><input className='input' placeholder='120.571' value={form.lng} onChange={e=>setForm({...form, lng:e.target.value})}/></div>
            <div className='flex items-end'><button type='button' className='btn' onClick={useMyLoc}>Use my location</button></div>
          </div>

          <button disabled={loading} className='btn'>{loading ? 'Posting…' : 'Post gig'}</button>
        </form>
      </div>
    </Protected>
  )
}
