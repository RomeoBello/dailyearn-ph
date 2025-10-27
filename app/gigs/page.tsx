'use client'
import { db } from '@/lib/firebase'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { distanceKm, getBrowserLocation } from '@/lib/geo'

type Gig = {
  id:string; title:string; description:string; category?:string; currency?:string; budget?:number;
  status?:string; createdAt?:any;
  location?:{ country?:string, region?:string, province?:string, city?:string, barangay?:string, lat?:number, lng?:number }
}

export default function Gigs(){
  const [gigs, setGigs] = useState<Gig[]>([])
  const [filters, setFilters] = useState({ province:'', city:'', radiusKm:0, useMyLocation:false })
  const [myLoc, setMyLoc] = useState<{lat:number,lng:number}|null>(null)

  useEffect(()=>{
    const qy = query(collection(db,'gigs'), orderBy('createdAt','desc'))
    return onSnapshot(qy, snap => setGigs(snap.docs.map(d=>({id:d.id, ...d.data()} as any))))
  }, [])

  async function grabLoc(){
    try { const loc = await getBrowserLocation(); setMyLoc(loc); setFilters({...filters, useMyLocation:true}) }
    catch(e){ alert('Could not get location: ' + (e as any)?.message) }
  }

  const filtered = useMemo(()=>{
    let list = gigs
    if (filters.province.trim()) list = list.filter(g => (g.location?.province||'').toLowerCase().includes(filters.province.toLowerCase()))
    if (filters.city.trim()) list = list.filter(g => (g.location?.city||'').toLowerCase().includes(filters.city.toLowerCase()))
    if (filters.useMyLocation && myLoc && filters.radiusKm>0){
      list = list.filter(g => {
        const gloc = g.location
        if (!gloc?.lat || !gloc?.lng) return false
        return distanceKm(myLoc, {lat:gloc.lat, lng:gloc.lng}) <= filters.radiusKm
      })
    }
    return list
  }, [gigs, filters, myLoc])

  return (
    <div className='card'>
      <div className='flex items-center justify-between mb-2'>
        <h1 className='text-xl font-bold'>Gigs (Philippines)</h1>
        <Link className='btn' href='/gigs/new'>Post a gig</Link>
      </div>

      <div className='grid md:grid-cols-4 gap-2 mb-3'>
        <input className='input' placeholder='Province (e.g., Pangasinan)' value={filters.province} onChange={e=>setFilters({...filters, province:e.target.value})}/>
        <input className='input' placeholder='City/Municipality (e.g., Urdaneta)' value={filters.city} onChange={e=>setFilters({...filters, city:e.target.value})}/>
        <div className='flex gap-2'>
          <input className='input' type='number' min='0' placeholder='Radius km (near me)' onChange={e=>setFilters({...filters, radiusKm:Number(e.target.value||0)})}/>
          <button className='btn' onClick={grabLoc}>Use my location</button>
        </div>
        <button className='btn' onClick={()=>{ setFilters({ province:'', city:'', radiusKm:0, useMyLocation:false }); setMyLoc(null) }}>Reset filters</button>
      </div>

      <div className='grid gap-2'>
        {filtered.map(g => (
          <div key={g.id} className='p-3 rounded-lg bg-white/5'>
            <div className='flex justify-between gap-3'>
              <div>
                <div className='font-semibold'>{g.title}</div>
                <div className='text-sm opacity-80'>
                  {(g.location?.province||'PH')} • {(g.location?.city||'')}
                  {g.location?.lat && g.location?.lng && myLoc && filters.useMyLocation && filters.radiusKm>0 ? (
                    <span className='badge ml-2'>{distanceKm(myLoc, {lat:g.location.lat, lng:g.location.lng}).toFixed(1)} km</span>
                  ) : null}
                </div>
              </div>
              <div className='text-right'>
                <div className='font-bold badge'>{g.currency || 'PHP'} {g.budget}</div>
                <div className='text-xs opacity-70'>{g.status || 'open'}</div>
              </div>
            </div>
            <p className='text-sm mt-1 opacity-90'>{g.description}</p>
          </div>
        ))}
        {filtered.length===0 && <p className='opacity-70 text-sm'>No gigs matching your filters.</p>}
      </div>
    </div>
  )
}
