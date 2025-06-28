"use client";

import { UserButton, useUser } from '@clerk/nextjs';
import { useRef, useState, useEffect } from 'react';
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { roboto } from '../fonts';
import {Button} from "@/components/ui/button";



export default function AppPage() {
  const { user } = useUser();
  const triggerRef = useRef<HTMLDivElement>(null);
  

  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setText("");
  };
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
        <div className="flex flex-col w-full h-[1000px] bg-white p-8 space-y-8 py-0 px-0">




          <div className='flex flex-col w-full h-[300px] bg-white text-red-50 items-center justify-center'>
            <h1 className={`text-3xl text-black bg-white px-3 py-3  ${roboto.className}`}>
      What Kind of Developer/Programmer do you want to become?
    </h1><div className='h-[3vh]'/>
           <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="I want to become a full stack developer and ....."
        className={`w-[1000px] p-3 rounded-md border text-black border-gray-300 hover:bg-red-200 resize-none min-h-[6rem] focus:outline-none transition-colors duration-200 ${
          submitted ? "bg-gray-200" : "bg-white"
        }`}
      />





      <div className='h-[2vh]'/>
      <Button
  onClick={handleSubmit}
  className="px-10 py-2 bg-white text-black rounded-xl transition-all duration-200 hover:bg-red-200 hover:text-black hover:shadow-md hover:scale-[1.03]"
>
  Enter
</Button> 









          </div><div className='flex flex-col w-full h-[400px] bg-white text-red-50 items-center justify-center'>
            <h1 className={`text-3xl text-black bg-white px-3 py-3  ${roboto.className}`}>
      What code have you written recendtly?
    </h1><div className='h-[3vh]'/>
           <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="I want to become a full stack developer and ....."
        className={`w-[1200px] p-3 rounded-md border text-black border-gray-300 resize-none min-h-[14rem] focus:outline-none transition-colors duration-200 hover:bg-red-200 ${
          submitted ? "bg-gray-200" : "bg-white"
        }`}
      />





      <div className='h-[2vh]'/>
      <Button
  onClick={handleSubmit}
  className="px-10 py-2 bg-white text-black rounded-xl transition-all duration-200 hover:bg-red-200 hover:text-black hover:shadow-md hover:scale-[1.03]"
>
  Enter
</Button> 









          </div>
        </div>

      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
