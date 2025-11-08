import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/admin/Sidebar';
import React from 'react';
import { SocialLinkItem } from '@/app/admin/redes/page'; // <-- 1. IMPORTAR EL TIPO

// --- 2. AÑADIR ESTA FUNCIÓN ---
// (Es la misma que usamos en la página principal)
async function getSocialLinks(supabase: any): Promise<SocialLinkItem[]> {
  const { data, error } = await supabase
    .from('redes_sociales')
    .select('*')
    .eq('estado', true) // Solo las activas
    .order('nombre', { ascending: true });
    
  if (error) console.error("Error al cargar redes sociales:", error.message);
  return data || [];
}
// --- FIN DE LA FUNCIÓN ---

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // --- 3. OBTENER AMBOS DATOS EN PARALELO ---
  const [
    { data: { user } },
    socialLinks // <-- Nueva variable
  ] = await Promise.all([
    supabase.auth.getUser(),
    getSocialLinks(supabase) // <-- Llamada a la nueva función
  ]);
  // --- FIN DEL CAMBIO ---

  if (!user) {
    redirect('/'); // Si no hay usuario, a la página principal
  }

  // 2. Si el usuario existe, renderiza el dashboard
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col">
      {/* --- 4. PASAR AMBAS PROPS AL NAVBAR --- */}
      <Navbar user={user} socialLinks={socialLinks} />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-8 overflow-auto bg-gradient-to-br from-white to-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}