import React from 'react';
import { ExperienciaItem } from '@/app/admin/experiencia/page'; // Importa el tipo

interface ExperienceSectionProps {
  experiences: ExperienciaItem[];
}

// Helper para formatear fechas
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
      <h2 className="text-slate-900 text-3xl font-bold px-4 pb-3 pt-5 border-b-2 border-blue-500 mb-4">Experiencia</h2>
      
      {experiences.length > 0 ? (
        experiences.map((exp) => (
          <div key={exp.id} className="px-4 py-3 mb-4">
            <p className="text-slate-800 text-lg font-medium leading-normal">{exp.puesto}</p>
            <p className="text-slate-600 text-md font-normal leading-normal">{exp.empresa}</p>
            <p className="text-slate-500 text-sm font-normal leading-normal">
              {formatDate(exp.fecha_inicio)} - {formatDate(exp.fecha_fin)}
            </p>
            <p className="text-slate-700 text-base leading-relaxed mt-2">
              {exp.descripcion}
            </p>
          </div>
        ))
      ) : (
        <p className="text-slate-500 px-4">Aún no hay experiencia para mostrar.</p>
      )}
    </section>
  );
};

export default ExperienceSection;