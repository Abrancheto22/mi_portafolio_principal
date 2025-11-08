import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import ProjectsTable from '@/components/admin/ProjectsTable';

export type PortafolioItem = {
  id: string;
  titulo: string;
  descripcion: string;
  tecnologias: string[];
  url_demo: string | null;
  url_github: string;
  fecha_creacion: string;
  image_url: string | null;
  estado: boolean;
};

async function getPortafolioItems(): Promise<PortafolioItem[]> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('proyectos')
    .select('*')
    .order('fecha_creacion', { ascending: false });

  if (error) {
    console.error("Error al cargar proyectos:", error);
    return [];
  }
  return data as PortafolioItem[];
}

export default async function AdminProyectosPage() {
  const proyectos = await getPortafolioItems();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-gray-900 text-3xl font-bold">
          Gestión de Proyectos
        </h1>

        <Link
          href="/admin/proyectos/create"
          className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 
                     bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold
                     shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
        >
          Nuevo Proyecto
        </Link>
      </div>
      <ProjectsTable proyectos={proyectos} />
    </div>
  );
}