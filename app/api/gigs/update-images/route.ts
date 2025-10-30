import { NextResponse } from 'next/server';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase'; // or '@/lib/firebase'

export async function POST(req: Request) {
  const { id, images } = await req.json();
  if (!id) return NextResponse.json({ ok: false, error: 'Missing id' }, { status: 400 });
  await updateDoc(doc(db, 'gigs', id), { images });
  return NextResponse.json({ ok: true });
}
