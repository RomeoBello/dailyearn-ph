'use client'
import { useRef, useState } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '@/lib/firebase'

export default function ImageUploader({ gigId, onUploaded, max = 5 }:{
  gigId: string, onUploaded: (urls:string[])=>void, max?: number
}) {
  const inputRef = useRef<HTMLInputElement|null>(null)
  const [progress, setProgress] = useState(0)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string|null>(null)

  async function handle(files: FileList) {
    const list = Array.from(files).slice(0,max)
    if (!list.length) return
    for (const f of list) {
      if (!f.type.startsWith('image/')) return setErr('Images only')
      if (f.size > 4*1024*1024)   return setErr('Max size 4MB')
    }

    setBusy(true); setErr(null)
    const urls: string[] = []; let done = 0
    await Promise.all(list.map(async (file,i)=>{
      const path = `gigs/${gigId}/${Date.now()}_${i}_${file.name}`
      const sref = ref(storage, path)
      const task = uploadBytesResumable(sref, file, { contentType: file.type })
      await new Promise<void>((res,rej)=>{
        task.on('state_changed',
          snap=>{
            const ratio = snap.bytesTransferred/snap.totalBytes
            const pct = (done + ratio/list.length) * 100
            setProgress(Math.round(pct))
          },
          rej,
          async ()=>{
            urls.push(await getDownloadURL(task.snapshot.ref))
            done += 1
            setProgress(Math.round((done/list.length)*100))
            res()
          })
      })
    }))
    onUploaded(urls)
    setBusy(false); setProgress(0)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-2">
      <input ref={inputRef} type="file" accept="image/*" multiple
             onChange={(e)=> e.target.files && handle(e.target.files)}
             className="block w-full text-sm"/>
      {busy && <div className="h-2 bg-black/20 rounded"><div className="h-2 bg-white rounded" style={{width:`${progress}%`}}/></div>}
      {err && <p className="text-xs text-red-300">{err}</p>}
      <p className="text-xs opacity-70">Up to 5 images, max 4MB each.</p>
    </div>
  )
}
