"use client";

import { UserButton, useUser } from '@clerk/nextjs';
import { useRef, useState, useEffect } from 'react';
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { roboto } from '../../fonts';
import { Button } from "@/components/ui/button";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { TextAnimate } from '@/components/magicui/text-animate';
import { AnimatePresence, motion } from 'framer-motion';

export default function AppPage() {
  const { user, isLoaded } = useUser();
  
  if (!isLoaded || !user) return <div>Loading...</div>;
  const router = useRouter();
  const triggerRef = useRef<HTMLDivElement>(null);

  const [goalText, setGoalText] = useState("");
  const [goalSubmitted, setGoalSubmitted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [codeText, setCodeText] = useState("");
  const [codeSubmitted, setCodeSubmitted] = useState(false);

  const [isNavigating, setIsNavigating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Remove the automatic navigation check
  // useEffect(() => {
  //   if (isLoaded && user) {
  //     checkUserDataAndNavigate();
  //   }
  // }, [isLoaded, user]);



  // Remove this function as we don't want automatic navigation
  // const checkUserDataAndNavigate = async () => {
  //   try {
  //     const response = await fetch('/api/get-user-data');
  //     if (!response.ok) throw new Error('Failed to fetch user data');
  //     
  //     const data = await response.json();
  //     console.log('User data:', data);
  //     
  //     if (data.hasData) {
  //       setIsNavigating(true);
  //       // Smooth transition delay before navigation
  //       setTimeout(() => {
  //         router.push('/result');
  //       }, 1000);
  //     }
  //   } catch (error) {
  //     console.error('Error checking user data:', error);
  //     setError('Failed to load user data');
  //   }
  // };

  const handleGoalSubmit = async () => {
    if (goalSubmitted || isTransitioning || !goalText.trim()) return;
    
    setIsTransitioning(true);
    setError(null);

    try {
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

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Out of API requests for today');
      }

      setTimeout(() => {
        setGoalSubmitted(true);
        setIsTransitioning(false);
        setGoalText("");
      }, 800);

    } catch (error) {
      console.error('Error saving goal:', error);
      setError(error instanceof Error ? error.message : 'Out of API requests for today');
      setIsTransitioning(false);
    }
  };

  const handleCodeSubmit = async () => {
    if (codeSubmitted || !codeText.trim()) return;
    
    setCodeSubmitted(true);
    setError(null);

    try {
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

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Out of API requests for today');
      }

      // Start navigation process after successful code submission
      // Only navigate when both goal and code have been submitted in this session
      setIsNavigating(true);
      setCodeText("");
      
      // Smooth transition delay before navigation
      setTimeout(() => {
        router.push('/result');
      }, 1000);
      
    } catch (error) {
      console.error('Error saving code:', error);
      setError(error instanceof Error ? error.message : 'Out of API requests for today');
      setCodeSubmitted(false);
    }
  };

  return (
    <>
      <SignedIn>
        <div className="min-h-screen flex flex-col">
          {/* Navbar */}
          <div className="flex items-center h-[9.5vh] bg-gray-100 px-8 shadow-sm">
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

          {/* Main Content */}
          <div className="flex-1">
            <BackgroundBeamsWithCollision className="!h-full min-h-[90.5vh]">
              <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 h-full">
                {error && (
                  <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Navigation Loading State */}
                {isNavigating ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                    <p className="text-lg text-gray-600">Preparing your results...</p>
                  </motion.div>
                ) : (
                  /* Input Forms */
                  <div className="flex flex-col items-center">
                    <AnimatePresence mode="wait">
                      {!goalSubmitted ? (
                        <motion.div 
                          key="first-text"
                          exit={{ opacity: 0, y: 0, filter: "blur(8px)" }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                          className="flex flex-col items-center mb-8"
                        >
                          <TextAnimate
                            by="word"
                            animation="slideDown"
                            duration={0.6}
                            className="text-2xl md:text-3xl lg:text-4xl font-bold text-black dark:text-white mb-4"
                            startOnView={false}
                          >
                            What is your project goal?
                          </TextAnimate>
                          <TextAnimate
                            by="word"
                            animation="fadeIn"
                            duration={0.6}
                            delay={0.2}
                            className="text-lg md:text-xl text-purple-600 dark:text-purple-400 font-medium"
                            startOnView={false}
                          >
                            you can share your programming goal as well
                          </TextAnimate>
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="second-text"
                          initial={{ opacity: 0, y: -50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                          className="flex flex-col items-center mb-8"
                        >
                          <TextAnimate
                            by="word"
                            animation="slideDown"
                            duration={0.6}
                            className="text-2xl md:text-3xl lg:text-4xl font-bold text-purple-600 dark:text-white mb-4"
                            startOnView={false}
                          >
                            What code have you written?
                          </TextAnimate>
                          <TextAnimate
                            by="word"
                            animation="fadeIn"
                            duration={0.6}
                            delay={0.2}
                            className="text-lg md:text-xl text-black dark:text-purple-400 font-medium"
                            startOnView={false}
                          >
                            share your existing code or progress
                          </TextAnimate>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="h-[4vh]" />

                    <div className={`transition-all duration-800 ${codeSubmitted ? 'blur-md opacity-50 pointer-events-none' : ''}`}>
                      <textarea
                        value={goalSubmitted ? codeText : goalText}
                        onChange={(e) => goalSubmitted ? setCodeText(e.target.value) : setGoalText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            goalSubmitted ? handleCodeSubmit() : handleGoalSubmit();
                          }
                        }}
                        placeholder={
                          goalSubmitted 
                            ? "Paste your code here or describe what you've built so far..." 
                            : "I want to build a Collaboration Dashboard with ....."
                        }
                        className="w-[1000px] p-3 rounded-md border text-black border-gray-300 hover:border-purple-600 resize-none min-h-[6rem] focus:outline-none transition-colors duration-200 bg-white"
                        disabled={codeSubmitted}
                      />
                      <div className='h-[2vh]'/>
                      <Button
                        onClick={goalSubmitted ? handleCodeSubmit : handleGoalSubmit}
                        disabled={isTransitioning || codeSubmitted || !(goalSubmitted ? codeText.trim() : goalText.trim())}
                        className="rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-md text-black shadow-sm ring-inset ring-gray-300 transition-all duration-200 hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                      >
                        {isTransitioning ? "..." : codeSubmitted ? "Processing..." : "Submit"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </BackgroundBeamsWithCollision>
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}