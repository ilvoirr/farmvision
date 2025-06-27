"use client";

import { UserButton, useUser } from '@clerk/nextjs';
import { useRef } from 'react';
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

export default function AppPage() {
  const { user } = useUser();
  const triggerRef = useRef<HTMLDivElement>(null);

  if (!user) return null;

  return (
    <>
      <SignedIn>
        <div className="flex items-center h-[4.5vw] bg-gray-100 px-8 shadow-sm">
          
          {/* Left Spacer */}
          <div className="w-[3vw]" />

          {/* Icon */}
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
            className="text-black"
          >
            <path d="M10 10.5 8 13l2 2.5" />
            <path d="m14 10.5 2 2.5-2 2.5" />
            <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z" />
          </svg>

          {/* Gap between icon and title */}
          <div className="w-[0.3vw]" />

          {/* Spacer between (missing) title and user button */}
          <div className="w-[80vw]" />

          {/* Username and UserButton */}
          <div
            className="inline-flex w-[110px] items-center justify-center gap-3 rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-lg font-semibold text-black shadow-sm ring-inset ring-gray-300 transition-all duration-200 hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => {
              const btn = triggerRef.current?.querySelector('button');
              btn?.click();
            }}
          >
            <span>{user.username}</span>
            <div ref={triggerRef} className="relative">
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonPopoverCard: {
                      transform: 'translateY(30px)' // Adjust this value as needed
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
        
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
