// app/profile/setup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function ProfileSetupPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const profile = {
      fullName: (fd.get("fullName") || "").toString().trim(),
      address: (fd.get("address") || "").toString().trim(),
      phone: (fd.get("phone") || "").toString().trim(),
      payoutMethod: (fd.get("payoutMethod") || "").toString(),
      payoutId: (fd.get("payoutId") || "").toString().trim(),
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    };

    const uid = auth.currentUser?.uid;
    if (!uid) {
      alert("Please login first.");
      return;
    }

    try {
      setSaving(true);
      await setDoc(doc(db, "profiles", uid), profile, { merge: true });
      router.push("/"); // or router.push("/dashboard")
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-[80vh] p-6 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-[#121A2E] text-white rounded-2xl p-6 space-y-4"
      >
        <h1 className="text-xl font-semibold">Complete your profile</h1>

        <input
          name="fullName"
          placeholder="Full name"
          className="w-full p-3 rounded bg-black/30 outline-none"
          required
        />
        <input
          name="address"
          placeholder="Address"
          className="w-full p-3 rounded bg-black/30 outline-none"
          required
        />
        <input
          name="phone"
          placeholder="Phone"
          className="w-full p-3 rounded bg-black/30 outline-none"
          required
        />

        <select
          name="payoutMethod"
          className="w-full p-3 rounded bg-black/30 outline-none"
          defaultValue="GCash"
        >
          <option value="GCash">GCash</option>
          <option value="Maya">Maya</option>
          <option value="Bank">Bank transfer</option>
        </select>

        <input
          name="payoutId"
          placeholder="GCash/Maya/Bank account #"
          className="w-full p-3 rounded bg-black/30 outline-none"
          required
        />

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-3 rounded bg-white text-black font-medium"
        >
          {saving ? "Saving…" : "Save & Continue"}
        </button>
      </form>
    </main>
  );
}
