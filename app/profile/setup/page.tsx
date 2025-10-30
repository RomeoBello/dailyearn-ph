'use client';

import { useEffect, useState, FormEvent } from 'react';
import { authSubscribe } from '@/firebase';

type ProfileForm = {
  fullName: string;
  phone: string;
  address: string;
  bank?: string;
  gcash?: string;
  maya?: string;
};

export default function ProfileSetupPage() {
  const [uid, setUid] = useState<string | null>(null);
  const [form, setForm] = useState<ProfileForm>({
    fullName: '',
    phone: '',
    address: '',
    bank: '',
    gcash: '',
    maya: '',
  });

  useEffect(() => {
    const unsub = authSubscribe(user => setUid(user ? user.uid : null));
    return () => unsub && unsub();
  }, []);

  function update<K extends keyof ProfileForm>(key: K, v: string) {
    setForm(prev => ({ ...prev, [key]: v }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // TODO: save to Firestore here
    alert('Saved! (wire to Firestore next)');
  }

  // Don’t render until we know auth state
  if (uid === null) return null;

  return (
    <main className="min-h-[80vh] p-6 flex justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-[#121A2E] text-white rounded-2xl p-6 space-y-4">
        <h1 className="text-xl font-semibold">Complete your profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-2">
            <span>Full name *</span>
            <input
              required
              value={form.fullName}
              onChange={e => update('fullName', e.target.value)}
              className="px-3 py-2 rounded text-black"
              placeholder="Juan Dela Cruz"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span>Phone *</span>
            <input
              required
              value={form.phone}
              onChange={e => update('phone', e.target.value)}
              className="px-3 py-2 rounded text-black"
              placeholder="+63 9xx xxx xxxx"
            />
          </label>

          <label className="flex flex-col gap-2 md:col-span-2">
            <span>Address *</span>
            <input
              required
              value={form.address}
              onChange={e => update('address', e.target.value)}
              className="px-3 py-2 rounded text-black"
              placeholder="Street, Barangay, City, Province"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span>Bank (optional)</span>
            <input
              value={form.bank}
              onChange={e => update('bank', e.target.value)}
              className="px-3 py-2 rounded text-black"
              placeholder="Bank & account no."
            />
          </label>

          <label className="flex flex-col gap-2">
            <span>GCash (optional)</span>
            <input
              value={form.gcash}
              onChange={e => update('gcash', e.target.value)}
              className="px-3 py-2 rounded text-black"
              placeholder="GCash number"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span>Maya (optional)</span>
            <input
              value={form.maya}
              onChange={e => update('maya', e.target.value)}
              className="px-3 py-2 rounded text-black"
              placeholder="Maya number"
            />
          </label>
        </div>

        <button
          type="submit"
          className="mt-2 bg-white text-[#121A2E] px-4 py-2 rounded font-medium"
        >
          Save
        </button>
      </form>
    </main>
  );
}
