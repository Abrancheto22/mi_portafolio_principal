import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
// Importa TODOS los componentes que se quedan en la página principal
import AboutSection from '@/components/AboutSection';
import ExperienceSection from '@/components/ExperienceSection';
import EducationSection from '@/components/EducationSection';
import HeroProfile from '@/components/HeroProfile';
import SkillsSection from '@/components/SkillsSection';
// Importa los tipos necesarios
import { ExperienciaItem } from '@/app/admin/experiencia/page'; 
import { EducacionItem } from '@/app/admin/educacion/page'; 
import { PerfilItem } from '@/app/admin/sobre-mi/page'; 
import { HabilidadItem } from '@/app/admin/habilidades/page';

// --- FUNCIONES DE OBTENCIÓN DE DATOS ---
// (Solo las que esta página necesita)

async function getProfile(supabase: any): Promise<PerfilItem | null> {
  const { data, error } = await supabase.from('perfil').select('*').limit(1).single();
  if (error) console.error("Error al cargar perfil:", error.message);
  return data;
}

async function getExperience(supabase: any): Promise<ExperienciaItem[]> {
  const { data, error } = await supabase.from('experiencia').select('*').eq('estado', true).order('fecha_inicio', { ascending: false });
  if (error) console.error("Error al cargar experiencia:", error.message);
  return data || [];
}

async function getEducation(supabase: any): Promise<EducacionItem[]> {
  const { data, error } = await supabase.from('educacion').select('*').eq('estado', true).order('fecha_inicio', { ascending: false });
  if (error) console.error("Error al cargar educación:", error.message);
  return data || [];
}

async function getSkills(supabase: any): Promise<HabilidadItem[]> {
  const { data, error } = await supabase.from('habilidades').select('*').eq('estado', true).order('nombre', { ascending: true });
  if (error) console.error("Error al cargar habilidades:", error.message);
  return data || [];
}

// --- PÁGINA PRINCIPAL---
export default async function Home() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const [profile, experiences, educationItems, skills] = await Promise.all([
    getProfile(supabase),
    getExperience(supabase),
    getEducation(supabase),
    getSkills(supabase),
  ]);

  return (
    <div className="layout-container flex h-full grow flex-col">
      <div className="px-4 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
        
        {/* Contenedor de una sola columna */}
        <div className="layout-content-container flex flex-col max-w-4xl w-full"> {/* <-- max-w-4xl */}
          
          {profile && <HeroProfile profile={profile} />}
          {profile && <AboutSection aboutText={profile.acerca_de} />} 
          
          {/* Las líneas de tiempo que te gustaron */}
          <div className="mt-16">
            <ExperienceSection experiences={experiences} />
          </div>
          <div className="mt-16">
            <EducationSection educationItems={educationItems} />
          </div>

          {/* El carrusel de habilidades irá aquí */}
          <SkillsSection skills={skills} />
          
        </div>
      </div>
    </div>
  );
}