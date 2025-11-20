import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ProjectForm from '@/components/admin/ProjectForm';
import Link from 'next/link';
import { PortafolioItem } from '../page';

// 1. Definimos el tipo para los items de la galería
export type GalleryItem = {
  id: string;
  url: string;
  tipo: string;
};

interface EditProjectPageProps {
  params: { id: string };
}

// 2. Función para obtener PROYECTO + GALERÍA
async function getProjectData(id: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // A. Obtener datos del Proyecto
  const { data: project, error: projError } = await supabase
    .from('proyectos')
    .select('*')
    .eq('id', id)
    .single();

  if (projError || !project) return null;

  // B. Obtener datos de la Galería (¡ESTA ES LA PARTE CLAVE!)
  const { data: gallery } = await supabase
    .from('proyecto_multimedia') // <--- Nombre de tu tabla de galería
    .select('*')
    .eq('proyecto_id', id); // <--- Filtrar por este proyecto

  return { 
    project: project as PortafolioItem, 
    gallery: (gallery as GalleryItem[]) || [] 
  };
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = params;
  
  // Cargamos los datos
  const data = await getProjectData(id);

  if (!data) {
    redirect('/admin/proyectos');
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-gray-900 text-3xl font-bold">
          Editar Proyecto: {data.project.titulo}
        </h1>
        <Link href="/admin/proyectos" className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-gray-600 hover:bg-gray-700 text-white text-sm font-bold">
          Cancelar
        </Link>
      </div>
      
      {/* 3. Pasamos la galería al formulario */}
      <ProjectForm 
        project={data.project} 
        gallery={data.gallery} // <--- ¡Asegúrate de que esto esté aquí!
      />
      
    </div>
  );
}