'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/firebase'; // ← change to '@/lib/firebase' if that’s your path

export default function ProfileSetupPage() {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    zip: '',
    payoutMethod: 'GCash',
    gcashNumber: '',
    mayaNumber: '',
    bankName: '',
    bankAccountName: '',
    bankAccountNumber: '',
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
      await setDoc(
        doc(db, 'users', uid),
        {
          ...form,
          updatedAt: serverTimestamp(),
          hasCompletedProfile: true,
        },
        { merge: true }
      );
      router.push('/'); // after save, back to homepage (or dashboard)
    } catch (err) {
      alert(`Save failed: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  }

  // Don’t render until we know auth state (prevents flicker)
  if (uid === null) return null;

  return (
    <main className="min-h-[80vh] p-6 flex justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-[#121A2E] text-white rounded-2xl p-6 space-y-4">
        <h1 className="text-xl font-semibold">Complete your profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-2">
            <span>Full name *</span>
            <input required value={form.fullName} onChange={(e) => update('fullName', e.target.value)} className="px-3 py-2 rounded bg-[#0B1426] border border-white/10" />
          </label>

          <label className="flex flex-col gap-2">
            <span>Phone *</span>
            <input required value={form.phone} onChange={(e) => update('phone', e.target.value)} className="px-3 py-2 rounded bg-[#0B1426] border border-white/10" />
          </label>

          <label className="flex flex-col gap-2 md:col-span-2">
            <span>Address *</span>
            <input required value={form.address} onChange={(e) => update('address', e.target.value)} className="px-3 py-2 rounded bg-[#0B1426] border border-white/10" />
          </label>

          <label className="flex flex-col gap-2">
            <span>City *</span>
            <input required value={form.city} onChange={(e) => update('city', e.target.value)} className="px-3 py-2 rounded bg-[#0B1426] border border-white/10" />
          </label>

          <label className="flex flex-col gap-2">
            <span>Province *</span>
            <input required value={form.province} onChange={(e) => update('province', e.target.value)} className="px-3 py-2 rounded bg-[#0B1426] border border-white/10" />
          </label>

          <label className="flex flex-col gap-2">
            <span>ZIP</span>
            <input value={form.zip} onChange={(e) => update('zip', e.target.value)} className="px-3 py-2 rounded bg-[#0B1426] border border-white/10" />
          </label>

          <label className="flex flex-col gap-2">
            <span>Payout method *</span>
            <select
              required
              value={form.payoutMethod}
              onChange={(e) => update('payoutMethod', e.target.value)}
              className="px-3 py-2 rounded bg-[#0B1426] border border-white/10"
            >
              <option>GCash</option>
              <option>Maya</option>
              <option>Bank</option>
            </select>
          </label>
        </div>

        {/* Conditional payout fields */}
        {form.payoutMethod === 'GCash' && (
          <label className="flex flex-col gap-2">
            <span>GCash number *</span>
            <input required value={form.gcashNumber} onChange={(e) => update('gcashNumber', e.target.value)} className="px-3 py-2 rounded bg-[#0B1426] border border-white/10" />
          </label>
        )}

        {form.payoutMethod === 'Maya' && (
          <label className="flex flex-col gap-2">
            <span>Maya number *</span>
            <input required value={form.mayaNumber} onChange={(e) => update('mayaNumber', e.target.value)} className="px-3 py-2 rounded bg-[#0B1426] border border-white/10" />
          </label>
        )}

        {form.payoutMethod === 'Bank' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2">
              <span>Bank name *</span>
              <input required value={form.bankName} onChange={(e) => update('bankName', e.target.value)} className="px-3 py-2 rounded bg-[#0B1426] border border-white/10" />
            </label>
            <label className="flex flex-col gap-2">
              <span>Account name *</span>
              <input required value={form.bankAccountName} onChange={(e) => update('bankAccountName', e.target.value)} className="px-3 py-2 rounded bg-[#0B1426] border border-white/10" />
            </label>
            <label className="flex flex-col gap-2 md:col-span-2">
              <span>Account number *</span>
              <input required value={form.bankAccountNumber} onChange={(e) => update('bankAccountNumber', e.target.value)} className="px-3 py-2 rounded bg-[#0B1426] border border-white/10" />
            </label>
          </div>
        )}

        <div className="pt-2 flex gap-3">
          <button disabled={saving} className="px-4 py-2 rounded bg-white text-black font-medium disabled:opacity-60">
            {saving ? 'Saving…' : 'Save profile'}
          </button>
          <button type="button" onClick={() => router.back()} className="px-4 py-2 rounded border border-white/20">
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
