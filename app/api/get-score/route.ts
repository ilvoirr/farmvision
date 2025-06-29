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
                  text: `You are an expert programming mentor evaluating how well the provided code aligns with the stated goal. Focus ONLY on goal alignment, not goal ambition.

SCORING GUIDELINES (ALIGNMENT-BASED):
- 90-100: Code perfectly or nearly perfectly achieves the stated goal
- 70-89: Code achieves most of the goal with minor gaps or improvements needed
- 50-69: Code partially achieves the goal but missing significant functionality
- 30-49: Code shows some progress toward the goal but major components missing
- 10-29: Code barely relates to the goal or has major functionality gaps
- 1-9: Code is completely unrelated to the goal or non-functional

EXAMPLES:
- Goal: "Print hello world" + Code: console.log("hello world") = 100 (perfect alignment)
- Goal: "Create a simple calculator" + Code: basic calc with +,-,*,/ = 95 (great alignment)
- Goal: "Build the next Facebook" + Code: basic login form = 15 (huge alignment gap)
- Goal: "Write #include <iostream>" + Code: #include <iostream> = 100 (perfect match)

Ignore how simple or ambitious the goal is. Only evaluate: Does the code achieve what they said they wanted to do?

Your response must be in this EXACT format:
SCORE: [number from 1-100]
CONGRATULATIONS: [exactly 2-3 sentences celebrating their progress toward their specific goal]
ADVICE: [exactly 4 sentences of specific, actionable advice on how to better achieve their stated goal]

DEVELOPER: ${userName || 'Developer'}
GOAL: ${goal}
CODE: ${code}

Evaluate the alignment between goal and code. Be strict about alignment, but don't penalize simple goals.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.3,
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
      : `Great work ${userName || 'there'}! You're making solid progress toward your goal. Keep building on what you've started!`;
    
    const advice = adviceMatch 
      ? adviceMatch[1].trim() 
      : `To better align with your goal, focus on implementing the specific features you mentioned. Break down your goal into smaller tasks and tackle them one by one. Test each piece of functionality to ensure it works as expected. Consider adding error handling and edge cases to make your implementation more robust.`;

    if (isNaN(rawScore) || rawScore < 1 || rawScore > 100) {
      console.error('Invalid score from AI:', rawScore);
      return NextResponse.json({ error: 'Invalid score received' }, { status: 500 });
    }

    // REMOVED the lenient scoring transformation - use raw score directly
    let adjustedScore = rawScore;

    // Only apply minimal adjustment for very low scores to keep them encouraging but realistic
    if (rawScore < 10) {
      adjustedScore = Math.max(5, rawScore); // Minimum score of 5 to not completely crush spirits
    }

    console.log('Score (no artificial inflation):', { rawScore, adjustedScore });

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