import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import ExperienceTable from '@/components/admin/ExperienceTable'; // La nueva tabla

// 1. Definimos el TIPO de dato (para que la tabla lo pueda importar)
// Asegúrate de que coincida con las columnas de tu tabla SQL
export type ExperienciaItem = {
  id: string;
  puesto: string;
  empresa: string;
  fecha_inicio: string; // Se leerán como string
  fecha_fin: string | null; // Puede ser nulo
  descripcion: string;
  created_at: string;
};

// 2. Función para obtener los datos (Server-Side)
async function getExperienciaItems(): Promise<ExperienciaItem[]> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Consultamos la NUEVA tabla 'experiencia'
  const { data, error } = await supabase
    .from('experiencia')
    .select('*')
    .order('fecha_inicio', { ascending: false }); // Ordenar por fecha

  if (error) {
    console.error("Error al cargar experiencias:", error);
    return [];
  }
  return data as ExperienciaItem[];
}

// 3. La página "Índice" de Experiencia
export default async function AdminExperienciaPage() {
  const experiencias = await getExperienciaItems();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-gray-900 text-3xl font-bold">
          Gestión de Experiencia
        </h1>
        {/* El botón "Nueva Experiencia" */}
        <Link
          href="/admin/experiencia/create" // (Esta página la crearemos después)
          className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 
                     bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold
                     shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
        >
          Nueva Experiencia
        </Link>
      </div>
      
      {/* La tabla de experiencias */}
      <ExperienceTable experiencias={experiencias} />
    </div>
  );
}