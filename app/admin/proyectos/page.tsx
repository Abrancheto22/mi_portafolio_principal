import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import ProjectsTable from '@/components/admin/ProjectsTable'; // La nueva tabla

// Definimos el tipo aquí para que la tabla lo pueda importar
export type PortafolioItem = {
  id: string;
  titulo: string;
  descripcion: string;
  tecnologias: string[];
  url_demo: string | null;
  url_github: string;
  fecha_creacion: string;
};

// Función para obtener los proyectos (Server-Side)
async function getPortafolioItems(): Promise<PortafolioItem[]> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('portafolio')
    .select('*')
    .order('fecha_creacion', { ascending: false });

  if (error) {
    console.error("Error al cargar proyectos:", error);
    return [];
  }
  return data as PortafolioItem[];
}

// La página "Índice" de Proyectos
export default async function AdminProyectosPage() {
  const proyectos = await getPortafolioItems();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-gray-900 text-3xl font-bold">
          Gestión de Proyectos
        </h1>
        {/* El botón "Nuevo Proyecto" que pediste */}
        <Link
          href="/admin/proyectos/create" // (Esta página la crearemos en el próximo paso)
          className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold"
        >
          Nuevo Proyecto
        </Link>
      </div>
      
      {/* La tabla de proyectos */}
      <ProjectsTable proyectos={proyectos} />
    </div>
  );
}