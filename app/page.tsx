import { createClient } from '@/lib/supabase/server'; // NUEVO
import { cookies } from 'next/headers'; // <-- AÑADE ESTO

// Importa todos los componentes modulares
import Navbar from '@/components/Navbar';
import AboutSection from '@/components/AboutSection';
import ExperienceSection from '@/components/ExperienceSection';
import EducationSection from '@/components/EducationSection';
import ProjectList from '@/components/ProjectList';
import ContactForm from '@/components/ContactForm';

// 1. La lógica de datos (Server-Side) se queda aquí
async function getPortafolioItems() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore); // NUEVO
  const { data, error } = await supabase
    .from('portafolio')
    .select('*')
    .order('fecha_creacion', { ascending: false });

  if (error) {
    console.error("Error al cargar datos:", error);
    return [];
  }
  return data;
}

// 2. El componente de página que ensambla todo
export default async function Home() {
  const cookieStore = cookies();

  // 1. OBTENER LOS PROYECTOS (como antes)
  const portafolioItems = await getPortafolioItems();

  // 2. OBTENER LA SESIÓN DEL USUARIO (¡NUEVO!)
  const supabase = createClient(cookieStore); // Cliente de servidor
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
      <Navbar user={user} />

      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            
            {/* --- SECCIÓN HERO (PERFIL) --- */}
            <div className="flex p-4 @container" id="profile">
              <div className="flex w-full flex-col gap-4 items-center">
                <div className="flex gap-4 flex-col items-center">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32 border-2 border-[#233648]"
                    style={{ backgroundImage: `url("https://i.pinimg.com/564x/9d/6b/9d/9d6b9db2dcb0526a09b89fb35d075c72.jpg")` }}
                  ></div>
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] text-center">
                      Abraham Ordoñez Reyes
                    </p>
                    <p className="text-[#92adc9] text-base font-normal leading-normal text-center">
                      Ingeniero de Sistemas
                    </p>
                    <p className="text-[#92adc9] text-base font-normal leading-normal text-center">
                      El Porvenir, Perú
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* --- COMPONENTES MODULARES --- */}
            
            <AboutSection />
            
            <ExperienceSection />
            
            <EducationSection />

            {/* --- PROYECTOS (DINÁMICO) --- */}
            <h2 id="projects" className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 scroll-mt-20">
              Proyectos
            </h2>
            <ProjectList items={portafolioItems} />
            
            <ContactForm />

          </div>
        </div>
      </div>
    </div>
  );
}