import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import EducationForm from '@/components/admin/EducationForm';
import Link from 'next/link';
import { EducacionItem } from '../page'; // Importamos el tipo

interface EditEducationPageProps {
  params: {
    id: string; // El ID (UUID)
  };
}

// Función para obtener un solo registro
async function getEducation(id: string): Promise<EducacionItem | null> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('educacion')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error("Error al cargar educación para edición:", error?.message);
    return null;
  }
  return data as EducacionItem;
}

export default async function EditEducationPage({ params }: EditEducationPageProps) {
  const { id } = params;
  const education = await getEducation(id);

  if (!education) {
    redirect('/admin/educacion');
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-gray-900 text-3xl font-bold">
          Editar Registro de Educación
        </h1>
        <Link
          href="/admin/educacion"
          className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-gray-600 hover:bg-gray-700 text-white text-sm font-bold"
        >
          Cancelar
        </Link>
      </div>
      
      <EducationForm education={education} />
      
    </div>
  );
}