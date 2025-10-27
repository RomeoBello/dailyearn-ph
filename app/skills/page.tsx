'use client'
import Protected from '@/components/Protected'
import { db, auth } from '@/lib/firebase'
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { useEffect, useState } from 'react'
export default function Skills(){
  const [skills, setSkills] = useState<any[]>([])
  const [form, setForm] = useState({ title:'I will type 3 pages', price:'120', currency:'PHP', window:'24h' })
  useEffect(()=>{
    const q = query(collection(db,'skills'), orderBy('createdAt','desc'))
    return onSnapshot(q, snap => setSkills(snap.docs.map(d=>({id:d.id, ...d.data()}))))
  }, [])
  async function addSkill(e:any){
    e.preventDefault()
    const user = auth.currentUser
    if(!user) return
    await addDoc(collection(db,'skills'), { title:form.title, price:Number(form.price), currency:form.currency, window:form.window, sellerUid:user.uid, createdAt:serverTimestamp() })
    setForm({ title:'', price:'', currency:'PHP', window:'24h' } as any)
  }
  return (
    <Protected>
      <div className='grid md:grid-cols-2 gap-3'>
        <div className='card'>
          <h1 className='text-xl font-bold mb-2'>Offer a Skill</h1>
          <form onSubmit={addSkill} className='grid gap-2'>
            <input className='input' placeholder='Title' value={form.title} onChange={e=>setForm({...form, title:e.target.value})}/>
            <div className='grid grid-cols-3 gap-2'>
              <input className='input' type='number' placeholder='Price' value={form.price} onChange={e=>setForm({...form, price:e.target.value})}/>
              <select className='input' value={form.currency} onChange={e=>setForm({...form, currency:e.target.value})}><option>PHP</option><option>CAD</option><option>USD</option></select>
              <select className='input' value={form.window} onChange={e=>setForm({...form, window:e.target.value})}><option>Same day</option><option>24h</option><option>48h</option></select>
            </div>
            <button className='btn'>Publish</button>
          </form>
        </div>
        <div className='card'>
          <h2 className='text-xl font-semibold mb-2'>Live Skill Cards</h2>
          <div className='grid gap-2'>
            {skills.map(s => (<div key={s.id} className='p-3 rounded-lg bg-white/5 flex items-center justify-between'><div><div className='font-semibold'>{s.title}</div><div className='text-sm opacity-80'>{s.window}</div></div><div className='badge'>{s.currency} {s.price}</div></div>))}
            {skills.length===0 && <p className='opacity-70 text-sm'>No skills yet.</p>}
          </div>
        </div>
      </div>
    </Protected>
  )
}
