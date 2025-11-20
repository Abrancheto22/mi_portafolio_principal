import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ProjectGallery from '@/components/ProjectGallery';
import { FaGithub, FaExternalLinkAlt, FaArrowLeft, FaCalendarAlt, FaCode } from 'react-icons/fa';
import Link from 'next/link';
import { PortafolioItem } from '@/app/admin/proyectos/page';
import FadeIn from '@/components/FadeIn'; // <--- 1. IMPORTAR FADEIN

// ... (Tipos y funciones getProjectDetails/generateMetadata SIN CAMBIOS) ...
type GalleryItem = {
  id: string;
  url: string;
  tipo: string;
};
interface ProjectDetailPageProps {
  params: { id: string };
}
async function getProjectDetails(id: string) {
    // ... (tu código existente)
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data: project, error: projectError } = await supabase.from('proyectos').select('*').eq('id', id).single();
    if (projectError || !project) return null;
    const { data: gallery } = await supabase.from('proyecto_multimedia').select('id, url, tipo').eq('proyecto_id', id);
    return { project: project as PortafolioItem, gallery: (gallery as GalleryItem[]) || [] };
}
export async function generateMetadata({ params }: ProjectDetailPageProps) {
    // ... (tu código existente)
    const data = await getProjectDetails(params.id);
    return { title: data ? `${data.project.titulo} | Abraham Ordoñez` : 'Proyecto no encontrado' };
}
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
};


// --- COMPONENTE PRINCIPAL ACTUALIZADO ---
export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const data = await getProjectDetails(params.id);

  if (!data) {
    redirect('/proyectos'); 
  }

  const { project, gallery } = data;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* Header / Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-6">
          <FadeIn> {/* Animamos la entrada del header */}
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
              <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full">
                <FaCalendarAlt className="text-slate-400" /> {formatDate(project.fecha_creacion)}
              </span>
            </div>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* COLUMNA IZQUIERDA (Galería) */}
          <div className="lg:col-span-8">
            {/* Animación con delay 0.1s */}
            <FadeIn delay={0.1}>
              <ProjectGallery 
                coverImage={project.image_url} 
                gallery={gallery} 
              />
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <div className="mt-10 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  Sobre el Proyecto
                </h3>
                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {project.descripcion}
                </div>
              </div>
            </FadeIn>
          </div>

          {/* COLUMNA DERECHA (Info Sticky) */}
          <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
            
            {/* Animación con delay 0.3s (aparece al final) */}
            <FadeIn delay={0.3} className="flex flex-col gap-6">
              
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Enlaces</h3>
                <div className="flex flex-col gap-3">
                  {project.url_demo && (
                    <a 
                      href={project.url_demo} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      <FaExternalLinkAlt /> Ver Demo en Vivo
                    </a>
                  )}
                  
                  <a 
                    href={project.url_github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <FaGithub size={20} /> Ver Código Fuente
                  </a>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <FaCode /> Stack Tecnológico
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tecnologias.map((tech: string) => (
                    <span 
                      key={tech} 
                      className="px-3 py-1.5 bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors cursor-default"
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