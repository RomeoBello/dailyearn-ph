'use client'
import { useEffect, useState } from 'react'
import { authSubscribe } from '@/lib/firebase'
import Link from 'next/link'
export default function Protected({children}:{children:React.ReactNode}){
  const [user, setUser] = useState<any>(undefined)
  useEffect(()=>authSubscribe(setUser),[])
  if (user===undefined) return <div className='container'>Loading…</div>
  if (!user) return <div className='container card'><h2 className='text-xl font-semibold mb-2'>Login required</h2><p>Please <Link className='underline' href='/login'>login</Link> to continue.</p></div>
  return <>{children}</>
}
