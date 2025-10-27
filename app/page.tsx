export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0B1220] text-white p-6">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-6">
        <div className="bg-[#121A2E] p-6 rounded-xl space-y-4">
          <h1 className="text-2xl font-bold">Earn today, anywhere in the Philippines</h1>
          <p>Post or accept small jobs, sell items, and offer skills with same-day completion.</p>
          <div className="flex space-x-3">
            <button className="bg-white text-black px-4 py-2 rounded-lg">Find gigs</button>
            <button className="bg-white text-black px-4 py-2 rounded-lg">Post a gig</button>
          </div>
        </div>
        <div className="bg-[#121A2E] p-6 rounded-xl space-y-4">
          <h2 className="text-xl font-semibold">Nationwide filters</h2>
          <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
            <li>Find gigs near your current location</li>
            <li>Filter by province/city and radius (km)</li>
            <li>PHP default currency; CAD/USD optional</li>
          </ul>
        </div>
      </div>
      <footer className="mt-10 text-sm text-gray-400">© DailyEarn PH • 2025</footer>
    </main>
  );
}
