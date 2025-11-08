import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import EducationTable from '@/components/admin/EducationTable';

// 1. Definimos el TIPO de dato
export type EducacionItem = {
  id: string;
  titulo: string;
  institucion: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  created_at: string;
};

// 2. Función para obtener los datos
async function getEducacionItems(): Promise<EducacionItem[]> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('educacion')
    .select('*')
    .order('fecha_inicio', { ascending: false });

  if (error) {
    console.error("Error al cargar educación:", error);
    return [];
  }
  return data as EducacionItem[];
}

// 3. La página "Índice"
export default async function AdminEducacionPage() {
  const educacionItems = await getEducacionItems();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-gray-900 text-3xl font-bold">
          Gestión de Educación
        </h1>
        <Link
          href="/admin/educacion/create"
          className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 
                     bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold
                     shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
        >
          Añadir Educación
        </Link>
      </div>
      
      <EducationTable educacionItems={educacionItems} />
    </div>
  );
}