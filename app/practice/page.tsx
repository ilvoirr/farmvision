"use client";

import { UserButton, useUser } from '@clerk/nextjs';
import { useRef, useState, useEffect } from 'react';
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { roboto } from '../fonts';
import { Button } from "@/components/ui/button";

export default function AppPage() {
    
  const { user } = useUser();
  const triggerRef = useRef<HTMLDivElement>(null);

  // 🧠 Independent state for each box
  const [goalText, setGoalText] = useState("");
  const [goalSubmitted, setGoalSubmitted] = useState(false);

  const [codeText, setCodeText] = useState("");
  const [codeSubmitted, setCodeSubmitted] = useState(false);

  // 🎯 Score state
  const [score, setScore] = useState<number | null>(null);
  const [isLoadingScore, setIsLoadingScore] = useState(false);
  const [hasData, setHasData] = useState(false);

  // Check if user has data and get score on component mount
  useEffect(() => {
    if (user) {
      checkUserDataAndGetScore();
    }
  }, [user]);

  if (!user) return null;

  const checkUserDataAndGetScore = async () => {
    try {
      const response = await fetch('/api/get-user-data');
      const data = await response.json();
      
      if (data.hasData) {
        setHasData(true);
        await getScore(data.goal, data.code);
      }
    } catch (error) {
      console.error('Error checking user data:', error);
    }
  };

  const getScore = async (goal: string, code: string) => {
    try {
      setIsLoadingScore(true);
      
      const response = await fetch('/api/get-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ goal, code }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setScore(data.score);
      } else {
        console.error('Error getting score:', data.error);
      }
    } catch (error) {
      console.error('Network error getting score:', error);
    } finally {
      setIsLoadingScore(false);
    }
  };

  const handleGoalSubmit = async () => {
    try {
      setGoalSubmitted(true);

      const response = await fetch("/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: goalText,
          type: "goal"
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error('Error saving goal:', result.error);
        alert('Error saving goal: ' + result.error);
        setGoalSubmitted(false);
        return;
      }

      console.log('Goal saved successfully:', result);
      setGoalText("");
      
      // Check for new score after saving
      setTimeout(() => {
        checkUserDataAndGetScore();
      }, 1000);
      
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error occurred');
      setGoalSubmitted(false);
    }
  };

  const handleCodeSubmit = async () => {
    try {
      setCodeSubmitted(true);

      const response = await fetch("/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: codeText,
          type: "code"
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error('Error saving code:', result.error);
        alert('Error saving code: ' + result.error);
        setCodeSubmitted(false);
        return;
      }

      console.log('Code saved successfully:', result);
      setCodeText("");
      
      // Check for new score after saving
      setTimeout(() => {
        checkUserDataAndGetScore();
      }, 1000);
      
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error occurred');
      setCodeSubmitted(false);
    }
  };

  return (
    <>
      <SignedIn>
        <div className="flex items-center h-[4.5vw] bg-gray-100 px-8 shadow-sm">
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
            className="text-black"
          >
            <path d="M10 10.5 8 13l2 2.5" />
            <path d="m14 10.5 2 2.5-2 2.5" />
            <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z" />
          </svg>

          <div className="w-[0.3vw]" />
          <div className="w-[80vw]" />

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
                      transform: 'translateY(30px)'
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full bg-white p-8 space-y-16">

          {/* Score Display */}
          {hasData && (
            <div className="flex flex-col w-full items-center justify-center">
              <h2 className={`text-4xl text-black bg-white px-3 py-3 ${roboto.className}`}>
                Code-Goal Alignment Score
              </h2>
              <div className="h-[2vh]"/>
              <div className="flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                {isLoadingScore ? (
                  <div className="text-white text-lg font-bold">...</div>
                ) : (
                  <div className="text-white text-5xl font-bold">
                    {score !== null ? score : "?"}
                  </div>
                )}
              </div>
              <div className="h-[1vh]"/>
              <p className="text-gray-600 text-lg">Out of 100</p>
            </div>
          )}

          {/* Goal Section */}
          <div className='flex flex-col w-full items-center justify-center'>
            <h1 className={`text-3xl text-black bg-white px-3 py-3 ${roboto.className}`}>
              What Kind of Developer/Programmer do you want to become?
            </h1>
            <div className='h-[3vh]'/>
            <textarea
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              placeholder="I want to become a full stack developer and ....."
              className={`w-[1000px] p-3 rounded-md border text-black border-gray-300 hover:bg-red-200 resize-none min-h-[6rem] focus:outline-none transition-colors duration-200 ${
                goalSubmitted ? "bg-gray-200" : "bg-white"
              }`}
            />
            <div className='h-[2vh]'/>
            <Button
              onClick={handleGoalSubmit}
              className="px-10 py-2 bg-white text-black rounded-xl transition-all duration-200 hover:bg-red-200 hover:text-black hover:shadow-md hover:scale-[1.03]"
            >
              Enter
            </Button> 
          </div>

          {/* Code Section */}
          <div className='flex flex-col w-full items-center justify-center'>
            <h1 className={`text-3xl text-black bg-white px-3 py-3 ${roboto.className}`}>
              What code have you written recently?
            </h1>
            <div className='h-[3vh]'/>
            <textarea
              value={codeText}
              onChange={(e) => setCodeText(e.target.value)}
              placeholder="Recently, I built a..."
              className={`w-[1200px] p-3 rounded-md border text-black border-gray-300 resize-none min-h-[14rem] focus:outline-none transition-colors duration-200 hover:bg-red-200 ${
                codeSubmitted ? "bg-gray-200" : "bg-white"
              }`}
            />
            <div className='h-[2vh]'/>
            <Button
              onClick={handleCodeSubmit}
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