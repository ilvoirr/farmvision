
import './globals.css'
import { Inter } from 'next/font/google'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  weight: ['500', '600'],
  subsets: ['latin'],
})


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'My App',
  description: 'A clean starter layout',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
    <html lang="en">
      <SignedIn><UserButton/></SignedIn><SignedOut></SignedOut>
      <body className={`${inter.className} min-h-screen bg-white text-black`}>
        {children}
      </body>
    </html>
    </ClerkProvider>
  )
}
