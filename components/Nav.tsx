'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { authSubscribe, logout } from '@/lib/firebase'

export default function Nav(){
  const [user, setUser] = useState<any>(null)
  useEffect(()=>authSubscribe(setUser),[])
  return (
    <nav className='container flex items-center justify-between'>
      <Link href='/' className='font-bold text-xl'>DailyEarn PH</Link>
      <div className='flex gap-1 items-center'>
        <Link className='navlink' href='/gigs'>Gigs</Link>
        <Link className='navlink' href='/gigs/new'>Post</Link>
        <Link className='navlink' href='/skills'>Skills</Link>
        <Link className='navlink' href='/sell'>Sell</Link>
        <Link className='navlink' href='/wallet'>Wallet</Link>
        <Link className='navlink' href='/profile'>Profile</Link>
        <Link className='navlink' href='/admin'>Admin</Link>
        {user ? <button className='navlink' onClick={logout}>Logout</button> : <Link className='navlink' href='/login'>Login</Link>}
      </div>
    </nav>
  )
}
