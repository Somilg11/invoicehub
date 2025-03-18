import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookies() }
  );

  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Auth session error:', error);
    return NextResponse.json({ error: 'Failed to refresh session' }, { status: 500 });
  }

  return NextResponse.json({ session });
}
