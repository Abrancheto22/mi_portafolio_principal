import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ProjectForm from '@/components/admin/ProjectForm';
import Link from 'next/link';
import { PortafolioItem } from '../page'; // Importamos el tipo

// Definición de las props que recibe la página
interface EditProjectPageProps {
  params: {
    id: string; // El ID del proyecto (el UUID)
  };
}

// Función para obtener un solo proyecto
async function getProject(id: string): Promise<PortafolioItem | null> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('proyectos')
    .select('*')
    .eq('id', id) // <-- Filtramos por el ID del proyecto
    .single(); // <-- Esperamos un solo resultado

  if (error || !data) {
    // Si no se encuentra o hay error, redirigimos a la tabla
    console.error("Error al cargar proyecto para edición:", error?.message);
    return null;
  }
  return data as PortafolioItem;
}

// Componente principal (Server Component asíncrono)
export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = params;
  
  const project = await getProject(id);

  // Si el proyecto no existe (p. ej., si alguien teclea una URL incorrecta)
  if (!project) {
    redirect('/admin/proyectos');
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-gray-900 text-3xl font-bold">
          Editar Proyecto: {project.titulo}
        </h1>
        <Link
          href="/admin/proyectos"
          className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-gray-600 hover:bg-gray-700 text-white text-sm font-bold"
        >
          Cancelar
        </Link>
      </div>
      
      {/* Reutilizamos el formulario, pero le pasamos los datos del proyecto */}
      <ProjectForm project={project} />
      
    </div>
  );
}