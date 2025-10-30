'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '@/firebase'; // or '@/lib/firebase'

export default function PostGigPage() {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    pricePHP: '',
    city: '',
    province: '',
    category: 'General',
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) router.replace('/login');
      else setUid(u.uid);
    });
    return () => unsub();
  }, [router]);

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!uid) return;
    setSaving(true);
    try {
      // 1) Create gig doc
      const docRef = await addDoc(collection(db, 'gigs'), {
        ownerId: uid,
        ...form,
        pricePHP: Number(form.pricePHP || 0),
        createdAt: serverTimestamp(),
        images: [] as string[],
        status: 'active',
      });

      // 2) Upload images (optional)
      const urls: string[] = [];
      if (files && files.length) {
        for (const f of Array.from(files).slice(0, 4)) {
          const path = `gigs/${uid}/${docRef.id}/${Date.now()}-${f.name}`;
          const storageRef = ref(storage, path);
          await uploadBytes(storageRef, f);
          urls.push(await getDownloadURL(storageRef));
        }
      }

      // 3) Patch the doc with image URLs
      if (urls.length) {
        await fetch('/api/gigs/update-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: docRef.id, images: urls }),
        });
      }

      router.push('/'); // or to a “gig detail” page later
    } catch (err) {
      alert(`Post failed: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  }

  if (uid === null) return null;

  return (
    <main className="min-h-[80vh] p-6 flex justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-[#121A2E] text-white rounded-2xl p-6 space-y-4">
        <h1 className="text-xl font-semibold">Post a gig</h1>

        <label className="flex flex-col gap-2">
          <span>Title *</span>
          <input required value={form.title} onChange={(e) => update('title', e.target.value)}
                 className="px-3 py-2 rounded bg-[#0B1426] border border-white/10" />
        </label>

        <label className="flex flex-col gap-2">
          <span>Description *</span>
          <textarea required rows={5} value={form.description} onChange={(e) => update('description', e.target.value)}
                    className="px-3 py-2 rounded bg-[#0B1426] border border-white/10" />
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-2">
            <span>Price (PHP) *</span>
            <input required type="number" min={0} value={form.pricePHP} onChange={(e) => update('pricePHP', e.target.value)}
                   className="px-3 py-2 rounded bg-[#0B1426] border border-white/10" />
          </label>

          <label className="flex flex-col gap-2">
            <span>Category</span>
            <select value={form.category} onChange={(e) => update('category', e.target.value)}
                    className="px-3 py-2 rounded bg-[#0B1426] border border-white/10">
              <option>General</option>
              <option>Errands</option>
              <option>Cleaning</option>
              <option>Repair</option>
              <option>Delivery</option>
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span>City *</span>
            <input required value={form.city} onChange={(e) => update('city', e.target.value)}
                   className="px-3 py-2 rounded bg-[#0B1426] border border-white/10" />
          </label>

          <label className="flex flex-col gap-2">
            <span>Province *</span>
            <input required value={form.province} onChange={(e) => update('province', e.target.value)}
                   className="px-3 py-2 rounded bg-[#0B1426] border border-white/10" />
          </label>
        </div>

        <label className="flex flex-col gap-2">
          <span>Photos (up to 4)</span>
          <input type="file" accept="image/*" multiple onChange={(e) => setFiles(e.target.files)}
                 className="file:mr-3 file:px-3 file:py-2 file:rounded file:bg-white file:text-black" />
        </label>

        <div className="pt-2 flex gap-3">
          <button disabled={saving} className="px-4 py-2 rounded bg-white text-black font-medium disabled:opacity-60">
            {saving ? 'Posting…' : 'Post gig'}
          </button>
          <button type="button" onClick={() => router.back()} className="px-4 py-2 rounded border border-white/20">
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
