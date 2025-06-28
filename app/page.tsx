"use client";

// -------------------- Font and UI Imports --------------------
import { roboto } from './fonts';
import { Button } from "@/components/ui/button";

// -------------------- React and Routing --------------------
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from 'next/link';

// -------------------- Clerk Authentication Components --------------------
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';

// ============================================================
//                    FONT CONFIGURATION
// ============================================================

// ============================================================
//        REDIRECT LOGIC WHEN USER IS SIGNED IN (CLERK)
// ============================================================

function RedirectToApp({ router }: { router: ReturnType<typeof useRouter> }) {
  useEffect(() => {
    router.push("/apppage");
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
      script.onload = () => {
        window.particlesJS.load('particles-js', '/polygon-particles.json', () => {
          console.log('callback - particles.js config loaded');
        });
      };
      document.body.appendChild(script);
    }
  }, []);

  return null;
}

// ============================================================
//                      MAIN PAGE COMPONENT
// ============================================================

export default function HomePage() {
  const router = useRouter();

  // Initialize particles.js on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
      script.onload = () => {
        window.particlesJS.load('particles-js', '/polygon-particles.json', () => {
          console.log('callback - particles.js config loaded');
        });
      };
      document.body.appendChild(script);
    }
  }, []);

  return (
    <>
      {/* ============================================================
          REDIRECT IF USER IS ALREADY SIGNED IN
      ============================================================ */}
      <SignedIn>
        <RedirectToApp router={router} />
      </SignedIn>

      {/* ============================================================
          TOP NAVIGATION BAR
      ============================================================ */}
      <div className="flex items-center h-[4.5vw] bg-[#110f1c] text-white px-8 shadow-sm">
        <div className="w-[3vw]" />

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

        <div className="w-[1vw]" />

        <h1 className="text-[1.3vw] font-semibold tracking-tight text-white">
          Code Progress Bar
        </h1>
        <div className='w-[1vw]'/>
<Link href="/red">
          <Button className="bg-transparent text-white/80 hover:text-white hover:bg-[#6c63fe] text-base">
            Light
          </Button>
        </Link>
        <div className="w-[58vw]" />

      

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <SignedOut>
              
              <SignInButton>
                <Button className="bg-transparent text-white/80 hover:text-white hover:bg-[#6c63fe] text-base">
                  Login
                </Button>
              </SignInButton>

              <SignUpButton>
                <Button className="bg-white text-gray-900 hover:bg-[#6c63fe] hover:text-white text-base">
                  Sign Up
                </Button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>

      {/* ============================================================
          HERO SECTION
      ============================================================ */}
      <div className="flex-col w-full h-auto bg-[#110f1c]">
        <div className="w-full h-[150px]" />

        <h1 className={`${roboto.className} text-6xl font-bold text-center max-w-[50vw] leading-tight mx-auto`}>
          <span className="text-white">Find out</span>{' '}
          <span className="text-[#6c63fe]">
            how close you are to your Coding Goal
          </span>
        </h1>

        <div className="w-full h-[100px]" />

        <div className="w-full h-[870px] overflow-hidden">
          <img
            src="/purplemain.svg"
            alt="Top cropped SVG"
            className="w-full h-auto block"
          />
        </div>
      </div>

      {/* ============================================================
          PARTICLE PLAYGROUND / REMINDER AREA
      ============================================================ */}
      <div className="h-[20px] w-full bg-black" />

      <div className={`h-[100px] w-full bg-red-700 flex items-center justify-center ${roboto.className}`}>
        <h1 className="text-white text-2xl font-semibold text-center">
          Particle Playground while you Procrastinate Logging In
        </h1>
      </div>

      {/* ============================================================
          PARTICLE BACKGROUND CANVAS
      ============================================================ */}
      <div className="relative h-[800px] w-full bg-red-700">
        <div id="particles-js" className="absolute inset-0" />
      </div>

      {/* ============================================================
          FOOTER SPACER / BOTTOM GAP
      ============================================================ */}
    </>
  );
}
