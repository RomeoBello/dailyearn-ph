# DailyEarn PH — Nationwide micro-gigs

This is a Philippines‑wide starter. Key additions:
- **Province/City fields** on gigs
- **Browser geolocation** capture (lat/lng)
- **Radius filter "near me"** on `/gigs`
- Default **PHP** currency (others optional)

## Quickstart
1) `npm install`
2) Setup Firebase (Auth, Firestore, Storage). Enable Google Sign‑in.
3) Copy `.env.local.example` → `.env.local`, paste Firebase web config.
4) `npm run dev` → http://localhost:3000

## Deploy
- Vercel for web. Add the same env vars.
- `npm run functions:deploy` to deploy Cloud Functions (optional).

## Roadmap for PH
- Add **GCash/Maya** payout confirmations (record as `transactions`).
- Seed supply in **every province** via FB groups & barangay pages.
- Add **geo index** (e.g., Firestore + geohash) if you want server‑side radius queries.
- Add **roles** (admin/moderator) and stricter security rules.
