"use client";

import { UserButton, useUser } from '@clerk/nextjs';
import { useRef, useState, useEffect } from 'react';
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { roboto } from '../fonts';
import { Poppins } from 'next/font/google';

interface FormData {
  expectations: string;
  coded: string;
}

export default function AppPage() {
  const { user } = useUser();
  const triggerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<FormData>({ expectations: '', coded: '' });
  const [savedData, setSavedData] = useState<FormData[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/coding-data', {
          headers: {
            'Content-Type': 'application/json',
            'Cookie': document.cookie
          },
          credentials: 'include', // Include cookies in the request
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setSavedData(data.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  const handleExpectationsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, expectations: e.target.value }));
  };

  const handleCodedChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, coded: e.target.value }));
  };

  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    try {
      const response = await fetch('/api/coding-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': document.cookie
        },
        credentials: 'include', // Include cookies in the request
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save data');
      }

      const data = await response.json();
      setSavedData(data.data);
      setFormData({ expectations: '', coded: '' });
    } catch (error: any) {
      console.error('Error saving data:', error);
      setError(error.message || 'Failed to save data. Please try again.');
    }
  }

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
        <div className="flex-col w-full h-[1000px] bg-red-200 p-8 space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <h1 className={`${roboto.className} text-2xl font-bold text-center`}>Elabore Your Coding Expectations and Goals</h1>
            <textarea
              placeholder="I want to be a full stack developer and ......."
              rows={3}
              value={formData.expectations}
              onChange={handleExpectationsChange}
              className={roboto.className + ' w-full max-w-md px-4 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-xl shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 overflow-y-auto'}
            />
          </div>

          <div className="flex flex-col items-center space-y-4">
            <h1 className={`${roboto.className} text-2xl font-bold text-center`}>What Have You Coded?</h1>
            <textarea
              placeholder="HTML boilerplate 2 lines and ........"
              rows={3}
              value={formData.coded}
              onChange={handleCodedChange}
              className={roboto.className + ' w-full max-w-md px-4 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-xl shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 overflow-y-auto'}
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="mt-4 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Enter
            </button>
            {error && (
              <div className="mt-2 text-sm text-red-600">{error}</div>
            )}
          </div>
        </div>

      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
