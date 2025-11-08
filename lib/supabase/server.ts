import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Usamos ReturnType para obtener el tipo exacto que devuelve la función cookies()
type CookieStore = ReturnType<typeof cookies>;

// La función AHORA ACEPTA nuestro tipo inferido
export function createClient(cookieStore: CookieStore) {
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set(name, value, options);
          } catch (error) {
            // Error esperado en Server Components, se ignora
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set(name, '', options);
          } catch (error) {
            // Error esperado en Server Components, se ignora
          }
        },
      },
    }
  );
}