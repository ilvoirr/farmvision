"use client";

import { UserButton, useUser } from '@clerk/nextjs';
import { useRef, useState } from 'react';
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { TextAnimate } from '@/components/magicui/text-animate';
import { AnimatePresence, motion } from 'framer-motion';

export default function AppPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const triggerRef = useRef<HTMLDivElement>(null);

  const [goalText, setGoalText] = useState("");
  const [goalSubmitted, setGoalSubmitted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [codeText, setCodeText] = useState("");
  const [codeSubmitted, setCodeSubmitted] = useState(false);

  const [isNavigating, setIsNavigating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isLoaded || !user) return <div>Loading...</div>;

  const handleGoalSubmit = async () => {
    if (goalSubmitted || isTransitioning || !goalText.trim()) return;

    setIsTransitioning(true);
    setError(null);

    try {
      const response = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: goalText, type: "goal" }),
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: codeText, type: "code" }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Out of API requests for today');
      }

      setIsNavigating(true);
      setCodeText("");

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
          {/* ---------------- Navbar ---------------- */}
          <div className="flex items-center h-[9.5vh] bg-gray-100 px-8 shadow-sm">
            {/* Left Spacer for logo alignment */}
            <div className="w-[3vw]" />

            {/* App Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-black w-[5vh] h-[5vh] md:w-[4.9vh] md:h-[4.9vh]"
            >
              <path d="M10 10.5 8 13l2 2.5" />
              <path d="m14 10.5 2 2.5-2 2.5" />
              <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z" />
            </svg>

            {/* Small spacer between icon and username */}
            <div className="w-[0.3vw]" />

            {/* Spacer to push user info to the right */}
            <div className="md:w-[80vw] w-[50vw]" />

            {/* User Info + Dropdown */}
            <div
              className="inline-flex w-[30vw] md:w-[7.5vw] items-center justify-center gap-3 rounded-lg border border-gray-200 bg-gray-100 md:px-4 md:py-[0.45vw] py-[0.6vh] px-[0.5vw] text-lg font-semibold text-black shadow-sm ring-inset ring-gray-300 transition-all duration-200 hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={() => {
                const btn = triggerRef.current?.querySelector('button');
                btn?.click();
              }}
            >
              <span className='md:text-[1.1vw] text-[2vh]'>{user.username}</span>
              <div ref={triggerRef} className="relative">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonPopoverCard: {
                        transform: 'translateY(3.5vh)',
                        '@media (max-width: 768px)': {
                          transform: 'translateY(3.5vh) translateX(4vw)'
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* ---------------- Main Section ---------------- */}
          <div className="flex-1">
            <BackgroundBeamsWithCollision className="!h-full min-h-[90.5vh]">
              <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 h-full">

                {/* Display error messages if any */}
                {error && (
                  <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Navigation Loader when submitting code */}
                {isNavigating ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4" />
                    <p className="text-lg text-gray-600">Preparing your results...</p>
                  </motion.div>
                ) : (
                  // Input section
                  <div className="flex flex-col items-center">
                    <AnimatePresence mode="wait">
                      {!goalSubmitted ? (
                        // Prompt for goal
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
                            you can share your programming goals as well
                          </TextAnimate>
                        </motion.div>
                      ) : (
                        // Prompt for code
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
                            className="text-lg md:text-sm text-black dark:text-purple-400 font-medium"
                            startOnView={false}
                          >
                            share your existing code or progress
                          </TextAnimate>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Spacer between question and input box */}
                    <div className="md:h-[4vh] h-[1vh]" />

                    {/* Textarea and Submit Button */}
                    <div className={`transition-all duration-800 ${codeSubmitted ? 'blur-md opacity-50 pointer-events-none' : ''}`}>
                      <textarea
                        value={goalSubmitted ? codeText : goalText}
                        onChange={(e) =>
                          goalSubmitted ? setCodeText(e.target.value) : setGoalText(e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            goalSubmitted ? handleCodeSubmit() : handleGoalSubmit();
                          }
                        }}
                        placeholder={
                          goalSubmitted
                            ? "Paste your code here or describe what you've built/plan to build so far..."
                            : "I want to build a Collaboration Dashboard with ....."
                        }
                        className="w-[75vw] md:w-[62.5vw] p-3 rounded-md border text-black border-gray-300 hover:border-purple-600 resize-none min-h-[6rem] focus:outline-none transition-colors duration-200 bg-white"
                        disabled={codeSubmitted}
                      />

                      {/* Spacer between textarea and button */}
                      <div className="h-[2vh] md:h-[2vh]" />

                      <Button
                        onClick={goalSubmitted ? handleCodeSubmit : handleGoalSubmit}
                        disabled={
                          isTransitioning ||
                          codeSubmitted ||
                          !(goalSubmitted ? codeText.trim() : goalText.trim())
                        }
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

      {/* If user is signed out, redirect to login */}
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
