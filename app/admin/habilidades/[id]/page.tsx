import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SkillForm from '@/components/admin/SkillForm';
import Link from 'next/link';
import { HabilidadItem } from '../page'; // Importamos el tipo

interface EditSkillPageProps {
  params: {
    id: string; // El ID (UUID)
  };
}

// Función para obtener un solo registro
async function getSkill(id: string): Promise<HabilidadItem | null> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('habilidades')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error("Error al cargar habilidad para edición:", error?.message);
    return null;
  }
  return data as HabilidadItem;
}

export default async function EditSkillPage({ params }: EditSkillPageProps) {
  const { id } = params;
  const skill = await getSkill(id);

  if (!skill) {
    redirect('/admin/habilidades');
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-gray-900 text-3xl font-bold">
          Editar Habilidad
        </h1>
        <Link
          href="/admin/habilidades"
          className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-gray-600 hover:bg-gray-700 text-white text-sm font-bold"
        >
          Cancelar
        </Link>
      </div>
      
      <SkillForm skill={skill} />
      
    </div>
  );
}