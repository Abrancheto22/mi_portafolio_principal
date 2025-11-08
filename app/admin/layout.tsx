import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar'; // Reutilizamos el Navbar principal
import Sidebar from '@/components/admin/Sidebar'; // Importamos el nuevo Sidebar
import React from 'react';

// Este layout protegerá TODAS las páginas que estén dentro de /admin/*
export default async function AdminLayout({
  children, // 'children' será la página específica (ej. /admin/proyectos)
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // 1. LÓGICA DE PROTECCIÓN (AHORA ESTÁ EN EL LAYOUT)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/'); // Si no hay usuario, a la página principal
  }

  // 2. Si el usuario existe, renderiza el dashboard
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col">
      {/* Pasamos el usuario al Navbar (para el botón de Logout) */}
      <Navbar user={user} />

      <div className="flex flex-1">
        {/* El Sidebar estático */}
        <Sidebar />

        {/* El contenido de la página (children) */}
        <main className="flex-1 p-8 overflow-auto bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}