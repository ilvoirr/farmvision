import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import supabase from '@/lib/supabase';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the latest goal and code for this user
    const { data: goalData, error: goalError } = await supabase
      .from('user_inputs')
      .select('content, created_at')
      .eq('user_id', userId)
      .eq('prompt_type', 'goal')
      .order('created_at', { ascending: false })
      .limit(1);

    const { data: codeData, error: codeError } = await supabase
      .from('user_inputs')
      .select('content, created_at')
      .eq('user_id', userId)
      .eq('prompt_type', 'code')
      .order('created_at', { ascending: false })
      .limit(1);

    if (goalError || codeError) {
      console.error('Supabase error:', goalError || codeError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    const latestGoal = goalData?.[0]?.content || null;
    const latestCode = codeData?.[0]?.content || null;

    return NextResponse.json({ 
      goal: latestGoal, 
      code: latestCode,
      hasData: !!(latestGoal && latestCode)
    });

  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}