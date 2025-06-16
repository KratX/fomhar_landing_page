import './globals.css'
import localFont from 'next/font/local'

// Load fonts (excluding Futura)
const achemost = localFont({
  src: '/fonts/achemost/Achemost.otf',
  variable: '--font-achemost',
  display: 'swap',
})

const bradley = localFont({
  src: '/fonts/bradley/BRADHI.ttf',
  variable: '--font-bradley',
  display: 'swap',
})

const helma = localFont({
  src: [
    { path: '/fonts/helma/Helma.ttf', weight: '400', style: 'normal' },
    // Add more Helma variants here if available
  ],
  variable: '--font-helma',
  display: 'swap',
})

const montserrat = localFont({
  src: [
    { path: '/fonts/montserrat/Montserrat-Regular.ttf', weight: '400', style: 'normal' },
    { path: '/fonts/montserrat/Montserrat-Bold.ttf', weight: '700', style: 'normal' },
    // Add more Montserrat variants here if available
  ],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata = {
  title: 'FOMHAR',
  description: 'Hi, this is an easter egg for you. Hire me at "kartikrawat9@gmail.com"',
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${achemost.variable} ${bradley.variable} ${helma.variable} ${montserrat.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
