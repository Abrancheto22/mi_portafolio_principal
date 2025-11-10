import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import ProjectList from '@/components/ProjectList';
import type { PortafolioItem } from '@/app/admin/proyectos/page'; // Importa el tipo
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mis Proyectos | Abraham Ordoñez',
  description: 'Una colección de los proyectos de Abraham Ordoñez, Ingeniero de Sistemas.',
};

// Función para obtener los proyectos (solo los activos)
async function getProjects(): Promise<PortafolioItem[]> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  const { data, error } = await supabase
    .from('proyectos')
    .select('*')
    .eq('estado', true)
    .order('fecha_creacion', { ascending: false });
    
  if (error) {
    console.error("Error al cargar proyectos:", error.message);
  }
  return data || [];
}

// La nueva página de Proyectos
export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="layout-container flex h-full grow flex-col">
      <div className="px-4 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          
          {/* --- SECCIÓN PROYECTOS --- */}
          <h2 id="projects" className="text-slate-900 text-3xl font-bold px-4 pb-3 pt-5 scroll-mt-20 border-b-2 border-blue-500 mb-6">
            Proyectos
          </h2>
          
          <ProjectList items={projects} />
          
        </div>
      </div>
    </div>
  );
}