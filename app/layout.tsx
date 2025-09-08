
import './globals.css'
import { Inter } from 'next/font/google'
import {
  ClerkProvider,
} from '@clerk/nextjs'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'FarmVision',
  description: 'Track your coding journey visually with Code Progress Bar – a simple, elegant app that lets developers monitor their project progress, stay motivated, and hit milestones faster.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
    <html lang="en">
      <head>
  <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
</head>
      <body className={`${inter.className} min-h-screen bg-white text-black`}>
        {children}
      </body>
    </html>
    </ClerkProvider>
  )
}
