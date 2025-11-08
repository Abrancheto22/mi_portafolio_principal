import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Esta función se ejecuta cuando alguien visita /auth/sign-out
export async function POST(req: Request) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // 1. Obtenemos la sesión actual
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    // 2. Cerramos la sesión en Supabase (esto borra la cookie)
    await supabase.auth.signOut();
  }

  // 3. Revalidamos el path (le decimos a Next.js que limpie la caché)
  revalidatePath('/', 'layout');

  // 4. Redirigimos al usuario a la página de login
  return NextResponse.redirect(new URL('/login', req.url), {
    status: 302,
  });
}