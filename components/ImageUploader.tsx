'use client'
import { useRef, useState } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '@/lib/firebase'

type Props = { gigId: string; onUploaded: (urls: string[]) => void; max?: number }

export default function ImageUploader({ gigId, onUploaded, max = 5 }: Props) {
  const inputRef = useRef<HTMLInputElement|null>(null)
  const [progress, setProgress] = useState<number>(0)
  const [busy, setBusy] = useState(false)
  const [errors, setErrors] = useState<string | null>(null)

  async function handleFiles(files: FileList) {
    setErrors(null)
    const selected = Array.from(files).slice(0, max)
    if (selected.length === 0) return

    for (const f of selected) {
      if (!f.type.startsWith('image/')) { setErrors('Only image files allowed'); return }
      if (f.size > 4 * 1024 * 1024) { setErrors('Max file size is 4MB'); return }
    }

    setBusy(true)
    const urls: string[] = []
    let completed = 0

    await Promise.all(selected.map(async (file, idx) => {
      const path = `gigs/${gigId}/${Date.now()}_${idx}_${file.name}`
      const storageRef = ref(storage, path)
      const task = uploadBytesResumable(storageRef, file, { contentType: file.type })
      await new Promise<void>((resolve, reject) => {
        task.on('state_changed', (snap) => {
          const ratio = (snap.bytesTransferred / snap.totalBytes)
          const pctEach = (1/selected.length) * ratio
          setProgress(Math.floor((completed + pctEach) * 100))
        }, reject, async () => {
          const url = await getDownloadURL(task.snapshot.ref)
          urls.push(url)
          completed += 1/selected.length
          setProgress(Math.floor(completed * 100))
          resolve()
        })
      })
    }))

    onUploaded(urls)
    setBusy(false)
    setProgress(0)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e)=> e.target.files && handleFiles(e.target.files)}
        className="block w-full text-sm"
      />
      {busy && <div className="h-2 w-full bg-black/20 rounded">
        <div className="h-2 bg-white rounded" style={{ width: `${progress}%`}} />
      </div>}
      {errors && <p className="text-xs text-red-300">{errors}</p>}
      <p className="text-xs opacity-70">Up to {max} images, max 4MB each.</p>
    </div>
  )
}
