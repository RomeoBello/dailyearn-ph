'use client'
import Protected from '@/components/Protected'
import { db } from '@/lib/firebase'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useEffect, useState } from 'react'
export default function Admin(){
  const [gigs, setGigs] = useState<any[]>([])
  const [reports, setReports] = useState<any[]>([])
  useEffect(()=>{
    const q1 = query(collection(db,'gigs'), orderBy('createdAt','desc'))
    const unsub1 = onSnapshot(q1, snap => setGigs(snap.docs.map(d=>({id:d.id, ...d.data()}))))
    const q2 = query(collection(db,'reports'))
    const unsub2 = onSnapshot(q2, snap => setReports(snap.docs.map(d=>({id:d.id, ...d.data()}))))
    return ()=>{unsub1();unsub2()}
  }, [])
  return (
    <Protected>
      <div className='grid md:grid-cols-2 gap-3'>
        <div className='card'>
          <h1 className='text-xl font-bold mb-2'>Admin — Gigs</h1>
          <div className='grid gap-2'>
            {gigs.map(g => (<div key={g.id} className='p-3 rounded-lg bg-white/5'><div className='font-semibold'>{g.title}</div><div className='text-xs opacity-80'>{g.status} • {g.currency} {g.budget} • {(g.location?.province||'PH')} {(g.location?.city||'')}</div></div>))}
            {gigs.length===0 && <p className='opacity-70 text-sm'>No gigs yet.</p>}
          </div>
        </div>
        <div className='card'>
          <h2 className='text-xl font-semibold mb-2'>Daily Reports</h2>
          <div className='grid gap-2'>
            {reports.map(r => (<div key={r.id} className='p-3 rounded-lg bg-white/5'><div className='font-semibold'>{r.id.replace('daily-','')}</div><div className='text-xs opacity-80'>GMV: {r.totalGMV} • Fees: {r.platformFees} • Payouts: {r.payoutsQueued} • Gigs: {r.totalGigs}</div></div>))}
            {reports.length===0 && <p className='opacity-70 text-sm'>No reports yet.</p>}
          </div>
        </div>
      </div>
    </Protected>
  )
}
