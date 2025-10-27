'use client'
import Protected from '@/components/Protected'
import { db, auth, storage } from '@/lib/firebase'
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useEffect, useState } from 'react'
export default function Sell(){
  const [items, setItems] = useState<any[]>([])
  const [form, setForm] = useState({ title:'', price:'', currency:'PHP', image:null as any })
  useEffect(()=>{
    const q = query(collection(db,'items'), orderBy('createdAt','desc'))
    return onSnapshot(q, snap => setItems(snap.docs.map(d=>({id:d.id, ...d.data()}))))
  }, [])
  async function addItem(e:any){
    e.preventDefault()
    const user = auth.currentUser
    if(!user) return
    let imageURL = ''
    if (form.image){
      const r = ref(storage, `items/${Date.now()}-${(form.image as any).name}`)
      await uploadBytes(r, form.image as any)
      imageURL = await getDownloadURL(r)
    }
    await addDoc(collection(db,'items'), { title:form.title, price:Number(form.price), currency:form.currency, imageURL, sellerUid:user.uid, createdAt:serverTimestamp() })
    setForm({ title:'', price:'', currency:'PHP', image:null } as any)
  }
  return (
    <Protected>
      <div className='grid md:grid-cols-2 gap-3'>
        <div className='card'>
          <h1 className='text-xl font-bold mb-2'>List an Item</h1>
          <form onSubmit={addItem} className='grid gap-2'>
            <input className='input' placeholder='Title' value={form.title} onChange={e=>setForm({...form, title:e.target.value})}/>
            <div className='grid grid-cols-3 gap-2'>
              <input className='input' type='number' placeholder='Price' value={form.price} onChange={e=>setForm({...form, price:e.target.value})}/>
              <select className='input' value={form.currency} onChange={e=>setForm({...form, currency:e.target.value})}><option>PHP</option><option>CAD</option><option>USD</option></select>
              <input className='input' type='file' onChange={e=>setForm({...form, image:e.target.files?.[0] || null})}/>
            </div>
            <button className='btn'>Publish</button>
          </form>
        </div>
        <div className='card'>
          <h2 className='text-xl font-semibold mb-2'>Marketplace</h2>
          <div className='grid gap-2'>
            {items.map(s => (<div key={s.id} className='p-3 rounded-lg bg-white/5 flex items-center justify-between'><div className='flex items-center gap-3'>{s.imageURL && <img src={s.imageURL} alt='' className='w-14 h-14 object-cover rounded-lg'/>}<div><div className='font-semibold'>{s.title}</div><div className='text-sm opacity-80'>Seller: {s.sellerUid?.slice(0,6)}…</div></div></div><div className='badge'>{s.currency} {s.price}</div></div>))}
            {items.length===0 && <p className='opacity-70 text-sm'>No items yet.</p>}
          </div>
        </div>
      </div>
    </Protected>
  )
}
