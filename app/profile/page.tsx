'use client'
import Protected from '@/components/Protected'
import { auth } from '@/lib/firebase'
export default function Profile(){
  const user = auth.currentUser
  return (
    <Protected>
      <div className='max-w-lg mx-auto card'>
        <h1 className='text-xl font-bold mb-2'>Profile</h1>
        {user ? (<div><div className='mb-1'>UID: <span className='badge'>{user.uid}</span></div><div className='mb-1'>Email: <span className='badge'>{user.email}</span></div><div className='mb-1'>Name: <span className='badge'>{user.displayName}</span></div><p className='opacity-70 text-sm mt-2'>Add ID-lite verification, ratings, and preferred province/city here.</p></div>) : <p>Loading…</p>}
      </div>
    </Protected>
  )
}
