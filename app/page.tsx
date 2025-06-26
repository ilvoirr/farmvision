import { roboto } from './fonts'
import { Poppins } from 'next/font/google'
import { Button } from "@/components/ui/button"

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

// Google font configuration
const poppins = Poppins({
  weight: ['500', '600'],
  subsets: ['latin'],
})

// --------------------
// Main Home Page Component
// --------------------
export default function HomePage() {
  return (
    <>

      {/* -------------------- Top Navigation Bar -------------------- */}
      <div className="flex items-center h-[4.5vw] bg-gray-900 text-white px-8 shadow-sm">
        
        {/* ---------- Left Margin Spacer ---------- */}
        <div className="w-[3vw]" />

        {/* ---------- Logo Icon ---------- */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="44"
          height="44"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#6c63fe]"
        >
          <path d="M10 10.5 8 13l2 2.5" />
          <path d="m14 10.5 2 2.5-2 2.5" />
          <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z" />
        </svg>

        {/* ---------- Spacer between logo and title ---------- */}
        <div className="w-[1vw]" />

        {/* ---------- Application Title ---------- */}
        <h1 className="text-[1.3vw] font-semibold tracking-tight text-white">
          Code Progress Bar
        </h1>

        {/* ---------- Flexible Space to Push Buttons Right ---------- */}
        <div className="w-[65vw]" />

        {/* ---------- Auth Buttons Section ---------- */}
        <div className="flex items-center gap-4">

          <div className="flex items-center gap-4">
            
            {/* --- Sign In Button --- */}
            <SignInButton>
              <Button variant="outline">
                Sign In
              </Button>
            </SignInButton>

            {/* --- Sign Up Button --- */}
            <SignUpButton>
              <Button variant="outline">
                Sign Up
              </Button>
            </SignUpButton>

          </div>

        </div>

      </div>


      {/* -------------------- Hero Section -------------------- */}
      <div className="flex-col w-full h-auto bg-[#110f1c]">

        {/* ---------- Spacer at Top of Hero Section ---------- */}
        <div className="w-full h-[150px]" />

        {/* ---------- Headline / Hero Title ---------- */}
        <h1
          className={`${roboto.className} text-6xl font-bold text-center max-w-[50vw] leading-tight mx-auto`}
        >
          <span className="text-white">Find out</span>{' '}
          <span className="text-[#6c63fe]">
            how close you are to your Coding Goal
          </span>
        </h1>

        {/* ---------- Space between text and image ---------- */}
        <div className="w-full h-[100px]" />

        {/* ---------- Hero Image Container ---------- */}
        <div className="w-full h-[870px] overflow-hidden">
          <img
            src="/mainpageimage.svg"
            alt="Top cropped SVG"
            className="w-full h-auto block"
          />
        </div>

      </div>


      {/* -------------------- Footer Spacer (or Future Section Placeholder) -------------------- */}
      <div className="flex w-full h-[200px] bg-white" />

    </>
  );
}
