import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { goal, code } = await req.json();

    console.log('Received data lengths:', {
      goalLength: goal?.length,
      codeLength: code?.length
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
                  text: `You are an expert programming mentor. You will be given a developer's goal and their recent code. Rate how well the code aligns with achieving their goal on a scale of 1-100. Respond with ONLY a number between 1-100, nothing else.

GOAL: ${goal}

CODE: ${code}

How well does this code align with achieving the stated goal? Rate from 1-100:`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 10,
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
    const scoreText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    console.log('Raw Gemini response:', scoreText);

    // Extract number from response
    const score = parseInt(scoreText);

    if (isNaN(score) || score < 1 || score > 100) {
      console.error('Invalid score from AI:', scoreText);
      return NextResponse.json({ error: 'Invalid score received' }, { status: 500 });
    }

    return NextResponse.json({ score });

  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}