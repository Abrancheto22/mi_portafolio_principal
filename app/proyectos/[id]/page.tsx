import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ProjectGallery from '@/components/ProjectGallery';
import { FaGithub, FaExternalLinkAlt, FaArrowLeft, FaCalendarAlt, FaCode, FaRocket } from 'react-icons/fa';
import Link from 'next/link';
import { PortafolioItem } from '@/app/admin/proyectos/page';
import FadeIn from '@/components/FadeIn';
import ExpandableText from '@/components/ExpandableText';
import ProjectDescription from '@/components/ProjectDescription';

type GalleryItem = {
  id: string;
  url: string;
  tipo: string;
};
interface ProjectDetailPageProps {
  params: { id: string };
}
async function getProjectDetails(id: string) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data: project, error: projectError } = await supabase.from('proyectos').select('*').eq('id', id).single();
    if (projectError || !project) return null;
    const { data: gallery } = await supabase.from('proyecto_multimedia').select('id, url, tipo').eq('proyecto_id', id);
    return { project: project as PortafolioItem, gallery: (gallery as GalleryItem[]) || [] };
}
export async function generateMetadata({ params }: ProjectDetailPageProps) {
    const data = await getProjectDetails(params.id);
    return { title: data ? `${data.project.titulo} | Abraham Ordoñez` : 'Proyecto no encontrado' };
}
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
};


export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const data = await getProjectDetails(params.id);
  if (!data) redirect('/proyectos');

  const { project, gallery } = data;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* Header / Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-6">
          <FadeIn>
            <Link 
              href="/proyectos" 
              className="inline-flex items-center text-slate-500 hover:text-blue-600 transition-colors font-medium text-sm mb-4"
            >
              <FaArrowLeft className="mr-2" size={12} /> Volver a Proyectos
            </Link>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              {project.titulo}
            </h1>
            <div className="flex items-center gap-4 mt-3 text-slate-500 text-sm">
              <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full font-medium">
                <FaCalendarAlt className="text-slate-400" /> {formatDate(project.fecha_creacion)}
              </span>
            </div>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* COLUMNA IZQUIERDA (Solo Galería ahora) */}
          <div className="lg:col-span-8">
            <FadeIn delay={0.1}>
              <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                <ProjectGallery 
                  coverImage={project.image_url} 
                  gallery={gallery} 
                />
              </div>
            </FadeIn>
          </div>

          {/* COLUMNA DERECHA (Información) */}
          <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
            
            <FadeIn delay={0.2} className="flex flex-col gap-6">
              
              {/* 1. SECCIÓN SOBRE EL PROYECTO (Movida aquí) */}
              <ProjectDescription 
                title={project.titulo} 
                description={project.descripcion} 
              />

              {/* 2. ESPACIO EXTRA ("ENTER") Y STACK TECNOLÓGICO */}
              <div className="mt-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FaCode className="text-blue-500" /> Stack Tecnológico
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tecnologias.map((tech: string) => (
                    <span 
                      key={tech} 
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold uppercase rounded-lg"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

            </FadeIn>

          </div>

        </div>
      </div>
    </div>
  );
}