'use client'
import { loginWithGoogle } from '@/lib/firebase'
export default function Login(){
  return (
    <div className='max-w-md mx-auto card'>
      <h1 className='text-2xl font-bold mb-2'>Login</h1>
      <p className='opacity-80 text-sm mb-4'>Sign in with Google for MVP.</p>
      <button onClick={loginWithGoogle} className='btn'>Continue with Google</button>
    </div>
  )
}
