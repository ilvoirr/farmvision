import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import supabase from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    console.log('User ID:', userId); // Debug log

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text, type } = await req.json();
    console.log('Received data:', { text, type }); // Debug log

    // Validate the data
    if (!text || !type) {
      return NextResponse.json({ error: "Missing text or type" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('user_inputs')
      .insert({
        user_id: userId,
        prompt_type: type,
        content: text,
      })
      .select(); // Add .select() to return the inserted data

    console.log('Supabase response:', { data, error }); // Debug log

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('API route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}