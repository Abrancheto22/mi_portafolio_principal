import React from 'react';
import { ExperienciaItem } from '@/app/admin/experiencia/page';

interface ExperienceSectionProps {
  experiences: ExperienciaItem[];
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return "Actualidad";
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
  });
};

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  return (
    <section id="experience" className="scroll-mt-20 mb-8">
      <h2 className="text-slate-900 text-3xl font-bold mb-10 border-b-2 border-blue-500 pb-3">
        Experiencia Laboral
      </h2>
      
      {/* Contenedor de la línea de tiempo */}
      <div className="relative pl-8 border-l-2 border-gray-200">
        {experiences.length > 0 ? (
          experiences.map((exp) => (
            // Tarjeta de cada item
            <div key={exp.id} className="mb-10 ml-4">
              {/* Círculo en la línea de tiempo */}
              <div className="absolute w-4 h-4 bg-blue-600 rounded-full mt-1.5 -left-2 border-2 border-white"></div>
              
              <time className="text-sm font-normal leading-none text-slate-500">
                {formatDate(exp.fecha_inicio)} - {formatDate(exp.fecha_fin)}
              </time>
              <h3 className="text-xl font-semibold text-slate-800 mt-1">{exp.puesto}</h3>
              <p className="text-md font-medium text-slate-600 mb-3">{exp.empresa}</p>
              <p className="text-base text-slate-700 leading-relaxed">
                {exp.descripcion}
              </p>
            </div>
          ))
        ) : (
          <p className="text-slate-500 ml-4">Aún no hay experiencia para mostrar.</p>
        )}
      </div>
    </section>
  );
};

export default ExperienceSection;