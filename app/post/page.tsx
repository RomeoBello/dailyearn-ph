// app/post/page.tsx
export default function Page() {
  return (
    <main className="min-h-[60vh] p-8 text-white">
      <h1 className="text-2xl font-semibold">/post route is alive ✅</h1>
      <p className="opacity-70 mt-2">If you see this, routing is good. Next we’ll restore the full form.</p>
    </main>
  );
}
// app/post/page.tsx
"use client";

export default function PostPage() {
  return (
    <main className="min-h-[60vh] p-6 text-white">
      <h1 className="text-xl font-semibold mb-4">Post a Gig</h1>
      <p>Gig posting form coming right up. (This placeholder prevents 404.)</p>
    </main>
  );
}
