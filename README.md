# DailyEarn PH — Gig Form Pack

Adds a complete "Post a gig" form with image uploads to Firebase Storage and Firestore.

## Files
- app/post/page.tsx — gig form
- components/ImageUploader.tsx — multi-image uploader with progress (max 5, 4MB each)
- types/Gig.ts — TypeScript type

## Requires
- `@/lib/firebase` exporting `auth`, `db`, and `storage`

## Firebase rules (example)
Firestore:
```
match /databases/{database}/documents {
  match /gigs/{gigId} {
    allow read: if true;
    allow create: if request.auth != null && request.auth.uid == request.resource.data.ownerUid;
    allow update, delete: if request.auth != null && request.auth.uid == resource.data.ownerUid;
  }
}
```
Storage:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /gigs/{gigId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

