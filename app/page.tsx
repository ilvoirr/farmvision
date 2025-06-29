"use client";

// -------------------- Font and UI Imports --------------------
import { roboto } from './fonts';
import { Button } from "@/components/ui/button";

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
//                   DESKTOP VERSION COMPONENT
// ============================================================

export function HomePageDesktop() {
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

      {/* Navigation header with logo, title, and auth buttons */}
      <div className="flex items-center h-[8vh] bg-[#110f1c] text-white px-8 shadow-sm">
        {/* Left spacing */}
        <div className="w-[3vw] md:w-[3vw] " />

        {/* Logo/Icon SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#6c63fe] w-[6vh] h-[6vh] md:w-[4.9vh] md:h-[4.9vh]"
        >
          <path d="M10 10.5 8 13l2 2.5" />
          <path d="m14 10.5 2 2.5-2 2.5" />
          <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z" />
        </svg>

        {/* Small spacing between logo and title */}
        <div className="w-[1hv] md:w-[1vw] " />

        {/* App title - hidden on mobile */}
        <h1 className="hidden md:inline-flex text-[1.3vw] font-semibold tracking-tight text-white">
          Code Progress Bar
        </h1>
        
        {/* Spacing after title */}
        <div className='w-[1vw]'/>
        
        {/* Light theme button - hidden on mobile */}
        <Link href="/red">
          <Button className="hidden md:inline-flex bg-transparent text-white/80 hover:text-white hover:bg-[#6c63fe] text-[1.77vh]">
            Light
          </Button>
        </Link>

        {/* Center spacing to push auth buttons to the right */}
        <div className="w-[25vw] md:w-[102.85vh]" />

        {/* Authentication buttons section */}
        <div className="flex items-center gap-4">
          {/* Show login/signup when user is signed out */}
          <SignedOut>
            <SignInButton>
              <Button className="only-1366 bg-transparent text-white/80 hover:text-white hover:bg-[#6c63fe] md:text-[1.77vh] text-[4vw]">
                Login
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button className="only-1366 bg-white text-gray-900 md:w-[5.75vw] w-[25vw] hover:bg-[#6c63fe] hover:text-white md:text-[1.77vh] text-[4vw]">
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
          HERO SECTION
      ============================================================ */}
      {/* Main hero container */}
      <div className="flex-col w-full md:h-auto h-screen bg-[#110f1c]">
        {/* Top spacing */}
        <div className="w-full h-[20vh] md:h-[16.55vh]" />

        {/* Main headline */}
        <h1 className={`${roboto.className} text-4xl md:text-6xl font-bold text-center md:max-w-[50vw] max-w-[70vw] leading-tight mx-auto`}>
          <span className="text-white">Find out</span>{' '}
          <span className="text-[#6c63fe]">
            how close you are to your Coding Goal
          </span>
        </h1>

        {/* Spacing between headline and image */}
        <div className="w-full md:h-[11vh] h-[15vh]" />

        {/* Hero image container */}
        <div className="w-full md:h-[870px] h- overflow-hidden">
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
      {/* Small black separator */}
      <div className="h-[2vh] w-full bg-black" />

      {/* Particle playground header */}
      <div className={`h-[8vh] w-full bg-red-700 flex items-center justify-center ${roboto.className}`}>
        <h1 className="text-white text-2xl font-semibold text-center">
          Particle Playground while you Procrastinate Logging In
        </h1>
      </div>

      {/* ============================================================
          PARTICLE BACKGROUND CANVAS
      ============================================================ */}
      {/* Particle animation container */}
      <div className="relative h-[92vh] w-full bg-red-700">
        <div id="particles-js" className="absolute inset-0" />
      </div>

      {/* ============================================================
          FOOTER SPACER / BOTTOM GAP
      ============================================================ */}
    </>
  );
}

// ============================================================
//                   MOBILE VERSION COMPONENT
// ============================================================

export function HomePageMobile() {
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

      {/* Navigation header with logo, title, and auth buttons */}
      <div className="flex items-center h-[8vh] bg-[#110f1c] text-white px-8 shadow-sm">
        {/* Left spacing */}
        <div className="w-[3vw] md:w-[3vw] " />

        {/* Logo/Icon SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#6c63fe] w-[6vh] h-[6vh] md:w-[4.9vh] md:h-[4.9vh]"
        >
          <path d="M10 10.5 8 13l2 2.5" />
          <path d="m14 10.5 2 2.5-2 2.5" />
          <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z" />
        </svg>

        {/* Small spacing between logo and title */}
        <div className="w-[1hv] md:w-[1vw] " />

        {/* App title - hidden on mobile */}
        <h1 className="hidden md:inline-flex text-[1.3vw] font-semibold tracking-tight text-white">
          Code Progress Bar
        </h1>
        
        {/* Spacing after title */}
        <div className='w-[1vw]'/>
        
        {/* Light theme button - hidden on mobile */}
        <Link href="/red">
          <Button className="hidden md:inline-flex bg-transparent text-white/80 hover:text-white hover:bg-[#6c63fe] text-[1.77vh]">
            Light
          </Button>
        </Link>

        {/* Center spacing to push auth buttons to the right */}
        <div className="w-[25vw] md:w-[102.85vh]" />

        {/* Authentication buttons section */}
        <div className="flex items-center gap-4">
          {/* Show login/signup when user is signed out */}
          <SignedOut>
            <SignInButton>
              <Button className="only-1366 bg-transparent text-white/80 hover:text-white hover:bg-[#6c63fe] md:text-[1.77vh] text-[4vw]">
                Login
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button className="only-1366 bg-white text-gray-900 md:w-[5.75vw] w-[25vw] hover:bg-[#6c63fe] hover:text-white md:text-[1.77vh] text-[4vw]">
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
          HERO SECTION
      ============================================================ */}
      {/* Main hero container - mobile specific heights */}
      <div className="flex-col w-full h-[92vh] bg-[#110f1c]">
        {/* Top spacing - smaller on mobile */}
        <div className="w-full h-[10vh] md:h-[16.55vh]" />

        {/* Main headline - mobile specific sizing */}
        <h1 className={`${roboto.className} h-[20vh] text-[5vh] font-bold text-center md:max-w-[50vw] max-w-[70vw] leading-tight mx-auto`}>
          <span className="text-white">Find out</span>{' '}
          <span className="text-[#6c63fe]">
            how close you are to your Coding Goal
          </span>
        </h1>

        {/* Spacing between headline and image */}
        <div className="w-full md:h-[11vh] h-[15vh]" />

        {/* Hero image container - mobile specific heights */}
        <div className="h-[47vh] h- overflow-hidden">    
          <img
            src="/purplemain.svg"
            alt="Top cropped SVG"
            className="w-full h-full object-cover block"
          />
        </div>
      </div>

      {/* ============================================================
          PARTICLE PLAYGROUND / REMINDER AREA
      ============================================================ */}
      {/* Small black separator - fixed pixel height for mobile */}
      <div className="h-[20px] w-full bg-black" />

      {/* Particle playground header - fixed pixel height for mobile */}
      <div className={`h-[100px] w-full bg-red-700 flex items-center justify-center ${roboto.className}`}>
        <h1 className="text-white text-2xl font-semibold text-center">
          Particle Playground while you Procrastinate Logging In
        </h1>
      </div>

      {/* ============================================================
          PARTICLE BACKGROUND CANVAS
      ============================================================ */}
      {/* Particle animation container - fixed pixel height for mobile */}
      <div className="relative h-[800px] w-full bg-red-700">
        <div id="particles-js" className="absolute inset-0" />
      </div>

      {/* ============================================================
          FOOTER SPACER / BOTTOM GAP
      ============================================================ */}
    </>
  );
}

// ============================================================
//              MAIN COMPONENT WITH RESPONSIVE LOGIC
// ============================================================

export default function HomePage() {
  // State to track if device is mobile
  const [isMobile, setIsMobile] = useState(false);

  // Effect to check and update device type on mount and resize
  useEffect(() => {
    // Function to determine if device is mobile
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    // Check on mount
    checkDevice();
    
    // Add resize listener
    window.addEventListener('resize', checkDevice);

    // Cleanup listener on unmount
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Render appropriate component based on device type
  return isMobile ? <HomePageMobile /> : <HomePageDesktop />;
}