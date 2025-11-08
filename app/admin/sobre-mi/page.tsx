import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/admin/ProfileForm';

// 1. Definimos el TIPO de dato
export type PerfilItem = {
  id: string;
  nombre_completo: string;
  titulo: string;
  ubicacion: string;
  acerca_de: string;
  url_foto_perfil: string | null;
};

// 2. Función para obtener el perfil (la única fila)
async function getProfile(): Promise<PerfilItem | null> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('perfil')
    .select('*')
    .limit(1) // <-- Asegura que solo traemos una fila
    .single(); // <-- Pide un solo objeto, no un array

  if (error || !data) {
    console.error("Error al cargar perfil:", error?.message);
    return null;
  }
  return data as PerfilItem;
}

// 3. La página de admin
export default async function AdminSobreMiPage() {
  const profile = await getProfile();

  if (!profile) {
    // Esto no debería pasar si ejecutaste el script SQL
    return <div className="text-red-500">Error: No se encontró el registro del perfil en la base de datos.</div>
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-gray-900 text-3xl font-bold">
          Gestión de Perfil y "Acerca de Mí"
        </h1>
        <p className="text-gray-600 mt-1">
          Esta información se mostrará en la página principal de tu portafolio.
        </p>
      </div>
      
      <ProfileForm profile={profile} />
    </div>
  );
}