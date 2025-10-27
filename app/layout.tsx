import './globals.css'
import Nav from '@/components/Nav'
export const metadata = {
  title: 'DailyEarn PH — micro-gigs nationwide',
  description: 'Nationwide micro-gigs, skills, and marketplace across the Philippines.'
}
export default function RootLayout({children}:{children:React.ReactNode}){
  return (
    <html lang='en'>
      <body>
        <Nav />
        <main className='container'>{children}</main>
        <footer className='container opacity-60 text-sm py-6'>© DailyEarn PH • {new Date().getFullYear()}</footer>
      </body>
    </html>
  )
}
