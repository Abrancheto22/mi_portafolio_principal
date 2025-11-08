import React from 'react';
import { HabilidadItem } from '@/app/admin/habilidades/page'; // Importa el tipo

interface SkillsSectionProps {
  skills: HabilidadItem[];
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  return (
    <section id="skills" className="scroll-mt-20 mb-8">
      <h2 className="text-slate-900 text-3xl font-bold px-4 pb-3 pt-5 border-b-2 border-blue-500 mb-6">
        Habilidades Técnicas
      </h2>
      
      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-3 px-4 py-3">
          {skills.map((skill) => (
            <div 
              key={skill.id} 
              className="px-4 py-2 rounded-lg shadow-sm
                         bg-gradient-to-r from-blue-600 to-purple-600 
                         text-white font-semibold transition-transform duration-200 hover:scale-105"
            >
              {skill.nombre}
              {/* Opcional: mostrar el tipo de habilidad */}
              {skill.tipo && (
                <span className="ml-2 text-xs opacity-75">({skill.tipo})</span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-500 px-4">Aún no hay habilidades para mostrar.</p>
      )}
    </section>
  );
};

export default SkillsSection;