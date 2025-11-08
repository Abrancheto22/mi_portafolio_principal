import React from 'react';
import { EducacionItem } from '@/app/admin/educacion/page'; // Importa el tipo

interface EducationSectionProps {
  educationItems: EducacionItem[];
}

// Helper para formatear fechas
const formatDate = (dateString: string | null) => {
  if (!dateString) return "Actualidad";
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
  });
};

const EducationSection: React.FC<EducationSectionProps> = ({ educationItems }) => {
  return (
    <section id="education" className="scroll-mt-20 mb-8">
      <h2 className="text-slate-900 text-3xl font-bold px-4 pb-3 pt-5 border-b-2 border-blue-500 mb-4">Educación</h2>
      
      {educationItems.length > 0 ? (
        educationItems.map((edu) => (
          <div key={edu.id} className="px-4 py-3 mb-4">
            <p className="text-slate-800 text-lg font-medium leading-normal">{edu.titulo}</p>
            <p className="text-slate-600 text-md font-normal leading-normal">{edu.institucion}</p>
            <p className="text-slate-500 text-sm font-normal leading-normal">
              {formatDate(edu.fecha_inicio)} - {formatDate(edu.fecha_fin)}
            </p>
          </div>
        ))
      ) : (
        <p className="text-slate-500 px-4">Aún no hay educación para mostrar.</p>
      )}
    </section>
  );
};

export default EducationSection;