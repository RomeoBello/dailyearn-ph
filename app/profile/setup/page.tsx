'use client';

import { useEffect, useState, FormEvent } from 'react';
import { onAuthSubscribe } from '@/firebase'; // ✅ THIS is the correct name
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';

type ProfileForm = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  payoutMethod: string;
  payoutAccount: string;
};

export default function ProfileSetupPage() {
  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<ProfileForm>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    country: 'PH',
    payoutMethod: '',
    payoutAccount: '',
  });

  // subscribe to auth
  useEffect(() => {
    const unsub = onAuthSubscribe((user) => {
      if (user) {
        setUid(user.uid);
      } else {
        setUid(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  function update<K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!uid) return;

    await setDoc(doc(db, 'profiles', uid), {
      ...form,
      updatedAt: new Date().toISOString(),
    });
    alert('Profile saved!');
  }

  // don't render until we know auth
  if (loading) return null;
  if (uid === null) {
    return (
      <main className="min-h-[80vh] p-6 flex justify-center items-center text-white">
        <p>You must log in first.</p>
      </main>
    );
  }

  return (
    <main className="min-h-[80vh] p-6 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-[#121A2E] text-white rounded-2xl p-6 space-y-4"
      >
        <h1 className="text-xl font-semibold">Complete your profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-2">
            <span>Full name *</span>
            <input
              required
              value={form.fullName}
              onChange={(e) => update('fullName', e.target.value)}
              className="px-3 py-2 rounded bg-[#0D1422] border border-[#1E2A3A]"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span>Phone *</span>
            <input
              required
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              className="px-3 py-2 rounded bg-[#0D1422] border border-[#1E2A3A]"
            />
          </label>

          <label className="flex flex-col gap-2 md:col-span-2">
            <span>Address *</span>
            <input
              required
              value={form.address}
              onChange={(e) => update('address', e.target.value)}
              className="px-3 py-2 rounded bg-[#0D1422] border border-[#1E2A3A]"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span>City *</span>
            <input
              required
              value={form.city}
              onChange={(e) => update('city', e.target.value)}
              className="px-3 py-2 rounded bg-[#0D1422] border border-[#1E2A3A]"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span>Country *</span>
            <input
              required
              value={form.country}
              onChange={(e) => update('country', e.target.value)}
              className="px-3 py-2 rounded bg-[#0D1422] border border-[#1E2A3A]"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span>Payout method (GCash / Maya / Bank) *</span>
            <input
              required
              value={form.payoutMethod}
              onChange={(e) => update('payoutMethod', e.target.value)}
              className="px-3 py-2 rounded bg-[#0D1422] border border-[#1E2A3A]"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span>Payout account / number *</span>
            <input
              required
              value={form.payoutAccount}
              onChange={(e) => update('payoutAccount', e.target.value)}
              className="px-3 py-2 rounded bg-[#0D1422] border border-[#1E2A3A]"
            />
          </label>
        </div>

        <button
          type="submit"
          className="bg-white text-[#121A2E] px-4 py-2 rounded font-semibold"
        >
          Save profile
        </button>
      </form>
    </main>
  );
}
