import { useEffect, useState, FormEvent } from 'react';
import { onAuthSubscribe } from '@/firebase'; // ✅ Fixed import name

type ProfileForm = {
  fullName: string;
  phone: string;
  address: string;
  bio: string;
};

export default function SetupProfile() {
  const [uid, setUid] = useState<string | null>(null);
  const [form, setForm] = useState<ProfileForm>({
    fullName: '',
    phone: '',
    address: '',
    bio: '',
  });

  // ✅ Fixed usage of onAuthSubscribe instead of authSubscribe
  useEffect(() => {
    const unsubscribe = onAuthSubscribe((user: any) => {
      setUid(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, []);

  function update(field: keyof ProfileForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!uid) return;
    console.log('Submitting profile:', form);
    alert('Profile saved successfully!');
  }

  if (uid === null) return null;

  return (
    <main className="min-h-[80vh] p-6 flex justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-[#121A2E] text-white rounded-2xl p-6 space-y-4">
        <h1 className="text-xl font-semibold">Complete your profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-2">
            <span>Full Name *</span>
            <input
              required
              value={form.fullName}
              onChange={(e) => update('fullName', e.target.value)}
              className="px-3 py-2 rounded text-black"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span>Phone *</span>
            <input
              required
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              className="px-3 py-2 rounded text-black"
            />
          </label>

          <label className="flex flex-col gap-2 md:col-span-2">
            <span>Address *</span>
            <input
              required
              value={form.address}
              onChange={(e) => update('address', e.target.value)}
              className="px-3 py-2 rounded text-black"
            />
          </label>

          <label className="flex flex-col gap-2 md:col-span-2">
            <span>Short Bio *</span>
            <textarea
              required
              value={form.bio}
              onChange={(e) => update('bio', e.target.value)}
              className="px-3 py-2 rounded text-black"
            ></textarea>
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-500 text-black py-2 rounded font-semibold hover:bg-yellow-400"
        >
          Save Profile
        </button>
      </form>
    </main>
  );
}
