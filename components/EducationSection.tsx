import React from 'react';
import { EducacionItem } from '@/app/admin/educacion/page';

interface EducationSectionProps {
  educationItems: EducacionItem[];
}

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
      <h2 className="text-slate-900 text-3xl font-bold mb-10 border-b-2 border-blue-500 pb-3">
        Educación
      </h2>
      
      {/* Contenedor de la línea de tiempo */}
      <div className="relative pl-8 border-l-2 border-gray-200">
        {educationItems.length > 0 ? (
          educationItems.map((edu) => (
            // Tarjeta de cada item
            <div key={edu.id} className="mb-10 ml-4">
              {/* Círculo en la línea de tiempo */}
              <div className="absolute w-4 h-4 bg-blue-600 rounded-full mt-1.5 -left-2 border-2 border-white"></div>
              
              <time className="text-sm font-normal leading-none text-slate-500">
                {formatDate(edu.fecha_inicio)} - {formatDate(edu.fecha_fin)}
              </time>
              <h3 className="text-xl font-semibold text-slate-800 mt-1">{edu.titulo}</h3>
              <p className="text-md font-medium text-slate-600 mb-3">{edu.institucion}</p>
            </div>
          ))
        ) : (
          <p className="text-slate-500 ml-4">Aún no hay educación para mostrar.</p>
        )}
      </div>
    </section>
  );
};

export default EducationSection;