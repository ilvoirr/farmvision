import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { goal, code, userName } = await req.json();

    console.log('Received data lengths:', {
      goalLength: goal?.length,
      codeLength: code?.length,
      userName: userName
    });

    if (!goal || !code) {
      return NextResponse.json({ error: "Missing goal or code" }, { status: 400 });
    }

    // Check if Gemini API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error('Gemini API key is missing');
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    console.log('Calling Gemini API...');

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an expert programming mentor speaking directly to a developer named ${userName || 'there'}. You will evaluate how well their code aligns with achieving their goal on a scale of 1-100, and provide personalized feedback.

Your response must be in this EXACT format:
SCORE: [number from 1-100]
CONGRATULATIONS: [exactly 2-3 sentences of warm, personal congratulations using their name, celebrating their effort and progress]
ADVICE: [exactly 4 sentences of specific, actionable advice on how to improve their code and increase their alignment score - be constructive and encouraging]

Be generous with scoring - if the code shows good effort and relevant skills, lean towards higher scores. Make all feedback feel personal and encouraging.

DEVELOPER: ${userName || 'Developer'}
GOAL: ${goal}
CODE: ${code}

Evaluate the alignment and provide your personalized response:`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 400,
          }
        }),
      }
    );

    console.log('Gemini API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error response:', errorText);
      return NextResponse.json({
        error: `Gemini API error: ${response.status} - ${errorText}`
      }, { status: 500 });
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    console.log('Raw Gemini response:', responseText);

    // Parse the response
    const scoreMatch = responseText.match(/SCORE:\s*(\d+)/i);
    const congratulationsMatch = responseText.match(/CONGRATULATIONS:\s*([\s\S]+?)(?=ADVICE:|$)/);
    const adviceMatch = responseText.match(/ADVICE:\s*([\s\S]+)$/);

    if (!scoreMatch) {
      console.error('Could not parse score from AI response:', responseText);
      return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
    }

    let rawScore = parseInt(scoreMatch[1]);
    const congratulations = congratulationsMatch 
      ? congratulationsMatch[1].trim() 
      : `Congratulations ${userName || 'there'}! You're making excellent progress on your coding journey. Your dedication and effort really show in your work!`;
    
    const advice = adviceMatch 
      ? adviceMatch[1].trim() 
      : `To improve your score, focus on aligning your code more closely with your stated goals. Consider breaking down your goal into smaller, specific features and implement them step by step. Add more comments to explain your logic and make your code more readable. Don't forget to test your functionality to ensure it works as expected.`;

    if (isNaN(rawScore) || rawScore < 1 || rawScore > 100) {
      console.error('Invalid score from AI:', rawScore);
      return NextResponse.json({ error: 'Invalid score received' }, { status: 500 });
    }

    // Apply lenient scoring transformation
    let adjustedScore = rawScore;
    
    if (rawScore >= 75) {
      // Map 75-100 to 90-100 (more generous in the high range)
      adjustedScore = Math.round(90 + ((rawScore - 75) / 25) * 10);
    } else if (rawScore >= 60) {
      // Map 60-74 to 80-89
      adjustedScore = Math.round(80 + ((rawScore - 60) / 14) * 9);
    } else if (rawScore >= 40) {
      // Map 40-59 to 65-79
      adjustedScore = Math.round(65 + ((rawScore - 40) / 19) * 14);
    } else {
      // Map 1-39 to 40-64 (still encouraging for low scores)
      adjustedScore = Math.round(40 + ((rawScore - 1) / 38) * 24);
    }

    // Ensure we don't exceed 100
    adjustedScore = Math.min(100, adjustedScore);

    console.log('Score transformation:', { rawScore, adjustedScore });

    return NextResponse.json({ 
      score: adjustedScore,
      congratulations: congratulations,
      advice: advice
    });

  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}