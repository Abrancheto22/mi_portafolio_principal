import { createClient } from '@supabase/supabase-js';

// 1. Obtener las variables de entorno
// Usamos '!' al final para indicar a TypeScript que confiamos en que estas variables existen.
const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 2. Control de errores (Aunque usamos '!', es una buena práctica de seguridad)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Faltan variables de entorno de Supabase. Revisa tu archivo .env.local',
  );
}

// 3. Crear y exportar el cliente
export const supabase = createClient(supabaseUrl, supabaseAnonKey);