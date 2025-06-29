"use client";

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {NumberTicker} from '@/components/magicui/number-ticker';
import {HyperText} from '@/components/magicui/hyper-text';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';


<style>
        {`
          @media (min-width: 1300px) and (max-width: 1400px) {
            .only-1366 {
              font-size: 1.6vh;
            }
          }
        `}
      </style>


interface ScoreData {
  score: number;
  congratulations: string;
  advice: string;
}

export default function ResultPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progressWidth, setProgressWidth] = useState(0);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      fetchScoreData();
    }
  }, [isLoaded, user]);

  const fetchScoreData = async () => {
    try {
      setLoading(true);
      setError(null);

      // First get the user data (goal and code)
      const userDataResponse = await fetch('/api/get-user-data');
      if (!userDataResponse.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const userData = await userDataResponse.json();
      console.log('User data:', userData);
      
      if (!userData.hasData) {
        throw new Error('No goal or code data found');
      }

      // Then get the score using the same method as the working app page
      const response = await fetch('/api/get-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          goal: userData.goal, 
          code: userData.code, 
          userName: user?.firstName || user?.username || 'Developer'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get score');
      }

      const data = await response.json();
      console.log('Score data:', data);
      
      setScoreData({
        score: data.score,
        congratulations: data.congratulations || 'Great work on your project!',
        advice: data.advice || 'Keep up the excellent progress!'
      });
      
      // Start animations after data is loaded
      setTimeout(() => {
        setProgressWidth(data.score);
      }, 500);

      // Show text after progress animation completes
      setTimeout(() => {
        setShowText(true);
      }, 3000);

    } catch (err) {
      console.error('Error fetching score:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-medium text-gray-800 mb-4">
            Wait a second...
          </div>
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-xl text-red-600">Error: {error}</div>
        <button
          onClick={() => router.push('/app')}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!scoreData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">No score data available</div>
      </div>
    );
  }

  return (<SignedIn>
    
    



    <div className="min-h-screen flex flex-col items-center justify-center relative bg-gradient-to-br from-gray-50 to-gray-100 px-8">
      <div className='h-[2vh] md:h-[8vh]'></div>
      <div className="flex flex-col items-center space-y-8 max-w-4xl w-full">
        {/* Progress Bar */}
        <div className="w-full max-w-2xl">
          <div className="relative w-full h-8 bg-gray-300 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-purple-900 to-purple-600 rounded-full transition-all duration-[2500ms] ease-out shadow-lg"
              style={{ width: `${progressWidth}%` }}
            />
            {/* Liquid effect overlay */}
            <div 
              className="absolute top-0 left-0 h-full bg-white opacity-20 rounded-full transition-all duration-[2500ms] ease-out"
              style={{
                width: `${progressWidth}%`,
                background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.3) 100%)',
                animation: progressWidth > 0 ? 'shimmer 2s ease-in-out infinite' : 'none'
              }}
            />
          </div>
        </div>

        {/* Score Display */}
        <div className="text-center">
          <div className="text-6xl font-bold text-gray-800 mb-2">
            <NumberTicker value={scoreData.score} className="text-6xl font-bold" />
            <span className="text-4xl text-gray-600">/100</span>
          </div>
          <div className="text-lg text-gray-600 font-medium">
            <HyperText 
              className="text-lg text-gray-600 font-medium"
            >
            progress Score
            </HyperText>
          </div>
        </div>

        {/* Encouragement and Advice */}
        <div 
          className={`space-y-6 transition-all duration-1000 ${
            showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Congratulations */}
          <div className=" text-center bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-black mb-3 flex items-center justify-center gap-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <HyperText 
                className="text-xl font-semibold text-black"
              >
                CONSENSUS
              </HyperText>
            </h3>
            <p className="text-gray-700 leading-relaxed text-md md:text-lg">
              {scoreData.congratulations}
            </p>
          </div>

          {/* Advice */}
          <div className="text-center bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-purple-600 mb-3 flex items-center justify-center gap-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <HyperText 
                className="text-xl font-semibold text-purple-600"
              >
                Next Steps
              </HyperText>
            </h3>
            <p className="text-gray-700 leading-relaxed text-md md:text-lg">
              {scoreData.advice}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div 
          className={`transition-all duration-1000 delay-500 ${
            showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <button
  onClick={() => router.push('/apppage')}
  className="rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-md text-black shadow-sm ring-inset ring-gray-300 transition-all duration-200 hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
>
  Go Back
</button>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
    </SignedIn>
  );
}