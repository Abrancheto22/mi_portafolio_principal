import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import SkillsTable from '@/components/admin/SkillsTable';

// 1. Definimos el TIPO de dato
export type HabilidadItem = {
  id: string;
  nombre: string;
  tipo: string | null;
  created_at: string;
  estado: boolean;
};

// 2. Función para obtener los datos
async function getHabilidades(): Promise<HabilidadItem[]> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('habilidades')
    .select('*')
    .order('nombre', { ascending: true }); // Ordenar alfabéticamente

  if (error) {
    console.error("Error al cargar habilidades:", error);
    return [];
  }
  return data as HabilidadItem[];
}

// 3. La página "Índice"
export default async function AdminHabilidadesPage() {
  const habilidades = await getHabilidades();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-gray-900 text-3xl font-bold">
          Gestión de Habilidades
        </h1>
        <Link
          href="/admin/habilidades/create"
          className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 
                     bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold
                     shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
        >
          Añadir Habilidad
        </Link>
      </div>
      
      <SkillsTable habilidades={habilidades} />
    </div>
  );
}