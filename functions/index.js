import { onDocumentCreated } from 'firebase-functions/v2/firestore'
import { onSchedule } from 'firebase-functions/v2/scheduler'
import admin from 'firebase-admin'
try { admin.app() } catch { admin.initializeApp() }
const db = admin.firestore()

export const onGigCreated = onDocumentCreated('gigs/{gigId}', async (event) => {
  const snap = event.data; if (!snap) return
  const gig = snap.data()
  const prov = gig?.location?.province
  if (!prov) return
  // Suggest earners by province (nationwide MVP). Improve with geo index later.
  const candidates = await db.collection('users').where('province','==', prov).get()
  const scored = []
  candidates.forEach(doc => {
    const u = doc.data()
    const rating = u.rating || 4.0
    const completed = u.completedGigs || 0
    const score = rating * 2 + completed * 0.1
    scored.push({ uid: doc.id, score })
  })
  scored.sort((a,b)=> b.score - a.score)
  const top = scored.slice(0,10).map(s=>s.uid)
  await db.doc(`gigs/${snap.id}`).set({ suggestedEarners: top }, { merge: true })
})

export const rollupDaily = onSchedule('every 60 minutes', async () => {
  const since = Date.now() - 24*60*60*1000
  const txSnap = await db.collection('transactions').where('createdAt', '>', new Date(since)).get()
  let platformFees = 0, totalGMV = 0, totalGigs = 0, payoutsQueued = 0
  txSnap.forEach(d => {
    const t = d.data()
    if (['gig','skill','sale'].includes(t.type)) totalGMV += t.amount || 0
    if (t.type === 'fee') platformFees += t.amount || 0
    if (t.type === 'payout') payoutsQueued += t.amount || 0
    if (t.relatedType === 'gig') totalGigs++
  })
  const key = new Date().toISOString().slice(0,10).replace(/-/g,'')
  await db.doc(`reports/daily-${key}`).set({ totalGMV, platformFees, payoutsQueued, totalGigs, createdAt: new Date() }, { merge: true })
})
