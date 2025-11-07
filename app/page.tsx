import { supabase } from '@/lib/supabaseClient'; // Importamos el cliente que creaste

// Esta función se ejecuta en el servidor de Next.js (Server Component)
async function getPortafolioItems() {
  // Hacemos la consulta a la tabla 'portafolio'
  const { data, error } = await supabase
    .from('portafolio')
    .select('*') // Selecciona todas las columnas
    .limit(10); // Limita a 10 elementos

  if (error) {
    // Muestra el error en la consola del servidor (terminal)
    console.error("Error al cargar datos:", error);
    return [];
  }
  return data;
}

// Componente principal de la página
export default async function Home() {
  const portafolioItems = await getPortafolioItems();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-6">Portafolio de Ingeniería (Conexión Exitosa)</h1>

      {portafolioItems.length > 0 ? (
        // Si hay datos, los mostramos
        <div className="bg-green-100 p-4 rounded-md border border-green-400">
          <p className="font-semibold text-green-700">✅ Conexión con Supabase verificada.</p>
          <h2 className="text-xl mt-2">Título del Proyecto Leído: {portafolioItems[0].titulo}</h2>
          <p className="text-sm">Tecnologías: {portafolioItems[0].tecnologias.join(', ')}</p>
          <p className="text-xs mt-2">ID en la DB: {portafolioItems[0].id}</p>
        </div>
      ) : (
        // Si no hay datos (o falló la lectura)
        <div className="bg-yellow-100 p-4 rounded-md border border-yellow-400">
          <p className="font-semibold text-yellow-700">⚠️ Conexión con DB OK, pero tabla 'portafolio' vacía. Inserta un dato en Supabase.</p>
        </div>
      )}
    </main>
  );
}