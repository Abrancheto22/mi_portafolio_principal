"use client";

import React from 'react';
import type { PortafolioItem } from '@/app/admin/proyectos/page'; 

interface ProjectListProps {
  items: PortafolioItem[];
}

const ProjectList: React.FC<ProjectListProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="p-4">
        <p className="text-slate-500 text-center">
          Actualmente no hay proyectos para mostrar.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 p-4">
      
      {items.map((item) => (
        // Fondo blanco, sombra sutil y borde de gradiente al hover
        <div 
          key={item.id} 
          className="group relative flex flex-col gap-3 rounded-xl overflow-hidden bg-white shadow-lg border border-gray-100
                     transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.03]"
        >
          {/* Borde de gradiente (pseudo-elemento) */}
          <div 
            className="absolute -inset-px rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500
                       opacity-0 transition-opacity duration-300 group-hover:opacity-75"
            aria-hidden="true"
          />
          {/* Contenedor del contenido (para que esté por encima del borde) */}
          <div className="relative z-10 flex flex-col h-full bg-white rounded-lg">
            <div
              className="w-full bg-center bg-no-repeat aspect-video bg-cover"
              // Usa la nueva 'image_url' del proyecto
              style={{ 
                backgroundImage: `url(${item.image_url || 'https://via.placeholder.com/300x160.png?text=Proyecto'})` 
              }}
            ></div>
            <div className="p-4 flex flex-col flex-grow">
              <p className="text-slate-900 text-lg font-bold leading-normal mb-2">
                {item.titulo}
              </p>
              <p className="text-slate-600 text-sm font-normal leading-normal flex-grow">
                {item.descripcion}
              </p>
              
              {/* Tags de Tecnologías con tema claro */}
              <div className="flex flex-wrap gap-2 mt-4">
                {item.tecnologias.map((tech) => (
                  <span key={tech} className="text-xs bg-blue-50 text-blue-700 font-medium px-2 py-1 rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;