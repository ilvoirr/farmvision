"use client";

// -------------------- Type Declarations --------------------
declare global {
  interface Window {
    particlesJS: any;
  }
}

// -------------------- Font and UI Imports --------------------
import { roboto } from './fonts';
import { Button } from "@/components/ui/button";
import { Libre_Baskerville } from 'next/font/google';

// Configure Libre Baskerville font
const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

// -------------------- React and Routing --------------------
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
//        REDIRECT LOGIC WHEN USER IS SIGNED IN (CLERK)
// ============================================================

// Component to handle redirect when user is already signed in
function RedirectToApp({ router }: { router: ReturnType<typeof useRouter> }) {
  // Redirect to app page immediately when component mounts
  useEffect(() => {
    router.push("/apppage");
  }, []);

  // Initialize particles.js after redirect
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
//                   MAIN HOMEPAGE COMPONENT
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
    <div className="overflow-x-hidden">
      {/* ============================================================
          REDIRECT IF USER IS ALREADY SIGNED IN
      ============================================================ */}
      <SignedIn>
        <RedirectToApp router={router} />
      </SignedIn>

      {/* ============================================================
          TOP NAVIGATION BAR - NOW FIXED
      ============================================================ */}

      {/* Custom CSS for specific screen size styling */}
      <style>
        {`
          @media (min-width: 1300px) and (max-width: 1400px) {
            .only-1366 {
              font-size: 1.6vh;
            }
          }
        `}
      </style>

      {/* Navigation header with logo, title, and auth buttons - FIXED POSITION */}
      <div className="fixed top-0 left-0 w-full flex items-center justify-between h-[8vh] bg-[#101413] text-white px-4 md:px-8 shadow-sm z-50">
        {/* Left side: Logo and title */}
        <div className="flex items-center">
          {/* Logo/Icon SVG */}
          <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white w-[5vh] h-[5vh] md:w-[4.9vh] md:h-[4.9vh]"
              >
                <path d="m10 11 11 .9a1 1 0 0 1 .8 1.1l-.665 4.158a1 1 0 0 1-.988.842H20" />
                <path d="M16 18h-5" />
                <path d="M18 5a1 1 0 0 0-1 1v5.573" />
                <path d="M3 4h8.129a1 1 0 0 1 .99.863L13 11.246" />
                <path d="M4 11V4" />
                <path d="M7 15h.01" />
                <path d="M8 10.1V4" />
                <circle cx="18" cy="18" r="2" />
                <circle cx="7" cy="15" r="5" />
              </svg>

          {/* App title - hidden on mobile */}
          <h1 className="hidden md:inline-flex text-[1.6vw] font-semibold tracking-tight text-white ml-3">
            FarmVision
          </h1>
        </div>

        {/* Right side: Authentication buttons */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Show login/signup when user is signed out */}
          <SignedOut>
            <SignInButton>
              <Button className="only-1366 bg-transparent text-white/80 hover:text-white hover:bg-[#425b3a] md:text-[1.77vh] text-[4vw] px-3 md:px-4">
                Login
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button className="only-1366 bg-white text-gray-900 hover:bg-[#425b3a] hover:text-white md:text-[1.77vh] text-[4vw] px-3 md:px-6">
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>
          
          {/* Show user button when signed in */}
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>

      {/* ============================================================
          HERO SECTION WITH FARMVISION TEXT OVERLAY - ADJUSTED FOR FIXED NAVBAR
      ============================================================ */}
      {/* Main hero container with page1.png background */}
      <div 
        className="w-screen h-screen bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: 'url(/page1.png)',
        }}
      >
        {/* FarmVision Text Overlay */}
        <div className="absolute inset-0 flex flex-col justify-center items-start px-8 md:px-16 lg:px-24 pt-20 md:pt-24 lg:pt-32">
          {/* Main Heading - FarmVision */}
          <h1 
            className={`${libreBaskerville.className} text-white text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-normal mb-4 md:mb-6 lg:mb-8 leading-none`}
          >
            FarmVision
          </h1>
          
          {/* Subtitle */}
          <p 
            className={`${libreBaskerville.className} text-white text-sm md:text-lg lg:text-xl xl:text-2xl max-w-2xl leading-relaxed font-light`}
          >
            Available 24/7 in Hindi and English because crops<br />
            don't sleep, and neither do we!
          </p>
        </div>
      </div>

      {/* Image sections */}
      <div className='w-screen h-screen'>
        <img 
          src="/page2.png" 
          alt="Page 2" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className='w-screen h-screen'>
        <img 
          src="/page3.png" 
          alt="Page 3" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className='w-screen h-screen'>
        <img 
          src="/page4.png" 
          alt="Page 4" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className='w-screen h-screen'>
        <img 
          src="/page5.png" 
          alt="Page 5" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* ============================================================
          FOOTER SPACER / BOTTOM GAP
      ============================================================ */}
    </div>
  );
}
