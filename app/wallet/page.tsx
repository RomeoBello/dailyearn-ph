'use client'
import Protected from '@/components/Protected'
import { db, auth } from '@/lib/firebase'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
export default function Wallet(){
  const [tx, setTx] = useState<any[]>([])
  const [userId, setUserId] = useState<string>('')
  useEffect(()=>{ const u = auth.onAuthStateChanged(u=>setUserId(u?.uid||'')); return ()=>u() },[])
  useEffect(()=>{
    if(!userId) return
    const q = query(collection(db,'transactions'), where('uid','==', userId), orderBy('createdAt','desc'))
    return onSnapshot(q, snap => setTx(snap.docs.map(d=>({id:d.id, ...d.data()}))))
  }, [userId])
  const total = tx.reduce((s,t)=> t.type!=='fee' ? s + (t.amount||0) : s, 0)
  return (
    <Protected>
      <div className='card'>
        <h1 className='text-xl font-bold mb-2'>Wallet</h1>
        <div className='mb-2'>Total (non-fee) movements: <span className='badge'>₱ {total}</span></div>
        <div className='grid gap-2'>
          {tx.map(t => (<div key={t.id} className='p-3 rounded-lg bg-white/5 flex items-center justify-between'><div><div className='font-semibold'>{t.type}</div><div className='text-xs opacity-80'>{new Date(t.createdAt?.toDate?.() || Date.now()).toLocaleString()}</div></div><div className='badge'>{t.currency || 'PHP'} {t.amount}</div></div>))}
          {tx.length===0 && <p className='opacity-70 text-sm'>No transactions yet.</p>}
        </div>
      </div>
    </Protected>
  )
}
