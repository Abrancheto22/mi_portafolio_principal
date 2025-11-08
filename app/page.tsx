import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import Navbar from '@/components/Navbar';
import AboutSection from '@/components/AboutSection';
import ExperienceSection from '@/components/ExperienceSection';
import EducationSection from '@/components/EducationSection';
import ProjectList from '@/components/ProjectList';
import ContactForm from '@/components/ContactForm';
import HeroProfile from '@/components/HeroProfile';
import SkillsSection from '@/components/SkillsSection';
import { PortafolioItem } from '@/app/admin/proyectos/page';
import { ExperienciaItem } from '@/app/admin/experiencia/page';
import { EducacionItem } from '@/app/admin/educacion/page';
import { PerfilItem } from '@/app/admin/sobre-mi/page';
import { HabilidadItem } from '@/app/admin/habilidades/page';

// --- FUNCIONES DE OBTENCIÓN DE DATOS ---

// 1. Obtener Perfil (el que acabamos de crear)
async function getProfile(supabase: any): Promise<PerfilItem | null> {
  const { data, error } = await supabase.from('perfil').select('*').limit(1).single();
  if (error) console.error("Error al cargar perfil:", error.message);
  return data;
}

// 2. Obtener Proyectos
async function getProjects(supabase: any): Promise<PortafolioItem[]> {
  const { data, error } = await supabase.from('proyectos').select('*').order('fecha_creacion', { ascending: false });
  if (error) console.error("Error al cargar proyectos:", error.message);
  return data || [];
}

// 3. Obtener Experiencia
async function getExperience(supabase: any): Promise<ExperienciaItem[]> {
  const { data, error } = await supabase.from('experiencia').select('*').order('fecha_inicio', { ascending: false });
  if (error) console.error("Error al cargar experiencia:", error.message);
  return data || [];
}

// 4. Obtener Educación
async function getEducation(supabase: any): Promise<EducacionItem[]> {
  const { data, error } = await supabase.from('educacion').select('*').order('fecha_inicio', { ascending: false });
  if (error) console.error("Error al cargar educación:", error.message);
  return data || [];
}

// 5. Obtener Habilidades
async function getSkills(supabase: any): Promise<HabilidadItem[]> {
  const { data, error } = await supabase.from('habilidades').select('*').order('nombre', { ascending: true });
  if (error) console.error("Error al cargar habilidades:", error.message);
  return data || [];
}

// --- PÁGINA PRINCIPAL ---
export default async function Home() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Obtenemos la sesión del usuario (para el botón de Admin/Logout)
  const { data: { user } } = await supabase.auth.getUser();

  // Cargamos TODOS los datos en paralelo para máxima velocidad
  const [profile, projects, experiences, educationItems, skills] = await Promise.all([
    getProfile(supabase),
    getProjects(supabase),
    getExperience(supabase),
    getEducation(supabase),
    getSkills(supabase),
  ]);

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col">
      <Navbar user={user} />

      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            
            {/* --- SECCIÓN HERO (PERFIL) - AHORA DINÁMICA --- */}
            {profile && <HeroProfile profile={profile} />}

            {/* --- SECCIÓN ACERCA DE - AHORA DINÁMICA --- */}
            {profile && <AboutSection aboutText={profile.acerca_de} />}
            
            {/* --- SECCIÓN EXPERIENCIA - AHORA DINÁMICA --- */}
            <ExperienceSection experiences={experiences} />
            
            {/* --- SECCIÓN EDUCACIÓN - AHORA DINÁMICA --- */}
            <EducationSection educationItems={educationItems} />

            {/* --- SECCIÓN HABILIDADES - AHORA DINÁMICA --- */}
            <SkillsSection skills={skills} />

            {/* --- SECCIÓN PROYECTOS (DINÁMICA) --- */}
            <h2 id="projects" className="text-slate-900 text-3xl font-bold px-4 pb-3 pt-5 scroll-mt-20 border-b-2 border-blue-500 mb-6">
              Proyectos
            </h2>
            <ProjectList items={projects} />
            
            <ContactForm />

          </div>
        </div>
      </div>
    </div>
  );
}