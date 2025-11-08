import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ExperienceForm from '@/components/admin/ExperienceForm'; // Reutilizamos el formulario
import Link from 'next/link';
import { ExperienciaItem } from '../page'; // Importamos el tipo de la página de índice

// Definición de las props que recibe la página
interface EditExperiencePageProps {
  params: {
    id: string; // El ID (UUID) de la experiencia
  };
}

// Función para obtener una sola experiencia
async function getExperience(id: string): Promise<ExperienciaItem | null> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('experiencia')
    .select('*')
    .eq('id', id) // <-- Filtramos por el ID
    .single(); // <-- Esperamos un solo resultado

  if (error || !data) {
    console.error("Error al cargar experiencia para edición:", error?.message);
    return null;
  }
  return data as ExperienciaItem;
}

// Componente principal (Server Component asíncrono)
export default async function EditExperiencePage({ params }: EditExperiencePageProps) {
  const { id } = params;
  
  const experience = await getExperience(id);

  // Si la experiencia no existe (URL incorrecta)
  if (!experience) {
    redirect('/admin/experiencia');
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-gray-900 text-3xl font-bold">
          Editar Experiencia
        </h1>
        <Link
          href="/admin/experiencia"
          className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-gray-600 hover:bg-gray-700 text-white text-sm font-bold"
        >
          Cancelar
        </Link>
      </div>
      
      {/* Reutilizamos el formulario, pasándole los datos de la experiencia */}
      <ExperienceForm experience={experience} />
      
    </div>
  );
}