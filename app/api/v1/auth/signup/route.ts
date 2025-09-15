import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { signupSchema } from '@/modules/users/users.schema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const supabase = await createClient(); // ✅ ensure await
    const { email, password } = parsed.data;

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      console.error('Supabase signup error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ user: data.user });
  } catch (err) {
    console.error('Signup API failed:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
