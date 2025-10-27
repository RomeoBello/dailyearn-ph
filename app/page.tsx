import Link from 'next/link'
export default function Home(){
  return (
    <div className='grid md:grid-cols-2 gap-4'>
      <div className='card'>
        <h1 className='text-2xl font-bold mb-2'>Earn today, anywhere in the Philippines</h1>
        <p className='mb-4'>Post or accept small jobs, sell items, and offer skills with same-day completion.</p>
        <div className='flex gap-2'>
          <Link className='btn' href='/gigs'>Find gigs</Link>
          <Link className='btn' href='/gigs/new'>Post a gig</Link>
        </div>
        <p className='mt-3 text-sm opacity-70'>Transparent 5% platform fee shown before confirm.</p>
      </div>
      <div className='card'>
        <h2 className='text-xl font-semibold mb-2'>Nationwide filters</h2>
        <ul className='list-disc ml-6 space-y-1 text-sm'>
          <li>Find gigs near your current location</li>
          <li>Filter by province/city and radius (km)</li>
          <li>PHP default currency; CAD/USD optional</li>
        </ul>
      </div>
    </div>
  )
}
