import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { SupabaseClient } from '@supabase/supabase-js';
// Importa TODOS los componentes que se quedan en la página principal
import AboutSection from '@/components/AboutSection';
import ExperienceSection from '@/components/ExperienceSection';
import EducationSection from '@/components/EducationSection';
import HeroProfile from '@/components/HeroProfile';
import SkillsSection from '@/components/SkillsSection';
import FadeIn from '@/components/FadeIn';
// Importa los tipos necesarios
import { ExperienciaItem } from '@/app/admin/experiencia/page'; 
import { EducacionItem } from '@/app/admin/educacion/page'; 
import { PerfilItem } from '@/app/admin/sobre-mi/page'; 
import { HabilidadItem } from '@/app/admin/habilidades/page';

// --- FUNCIONES DE OBTENCIÓN DE DATOS ---
// (Solo las que esta página necesita)

async function getProfile(supabase: SupabaseClient): Promise<PerfilItem | null> {
  const { data, error } = await supabase.from('perfil').select('*').limit(1).single();
  if (error) console.error("Error al cargar perfil:", error.message);
  return data as PerfilItem | null;
}

async function getExperience(supabase: SupabaseClient): Promise<ExperienciaItem[]> {
  const { data, error } = await supabase.from('experiencia').select('*').eq('estado', true).order('fecha_inicio', { ascending: false });
  if (error) console.error("Error al cargar experiencia:", error.message);
  return (data as ExperienciaItem[]) || [];
}

async function getEducation(supabase: SupabaseClient): Promise<EducacionItem[]> {
  const { data, error } = await supabase.from('educacion').select('*').eq('estado', true).order('fecha_inicio', { ascending: false });
  if (error) console.error("Error al cargar educación:", error.message);
  return (data as EducacionItem[]) || [];
}

async function getSkills(supabase: SupabaseClient): Promise<HabilidadItem[]> {
  const { data, error } = await supabase.from('habilidades').select('*').eq('estado', true).order('nombre', { ascending: true });
  if (error) console.error("Error al cargar habilidades:", error.message);
  return (data as HabilidadItem[]) || [];
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
        <div className="layout-content-container flex flex-col max-w-4xl w-full">

          <FadeIn>
            {profile && <HeroProfile profile={profile} />}
          </FadeIn>

          <FadeIn delay={0.2}>
            {profile && <AboutSection aboutText={profile.acerca_de} />}
          </FadeIn>

          <div className="mt-16">
            <FadeIn delay={0.3} direction="left">
              <ExperienceSection experiences={experiences} />
            </FadeIn>
          </div>

          <div className="mt-16">
            <FadeIn delay={0.4} direction="right">
              <EducationSection educationItems={educationItems} />
            </FadeIn>
          </div>

          <div className="mt-16">
            <FadeIn delay={0.5}>
              <SkillsSection skills={skills} />
            </FadeIn>
          </div>
          
        </div>
      </div>
    </div>
  );
}