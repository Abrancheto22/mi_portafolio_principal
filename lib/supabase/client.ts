"use client"; // Este cliente SÓLO se usa en componentes de cliente

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // Usamos createBrowserClient para el lado del cliente (navegador)
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}