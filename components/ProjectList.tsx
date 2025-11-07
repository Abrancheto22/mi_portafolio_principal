import React from 'react';

// Definición de Tipos (¡Esto ya lo teníamos!)
interface PortafolioItem {
  id: string;
  titulo: string;
  descripcion: string;
  tecnologias: string[]; // ¡Este campo no está en el HTML! Lo añadiremos
  url_demo: string | null;
  url_github: string;
}

interface ProjectListProps {
  items: PortafolioItem[];
}

const ProjectList: React.FC<ProjectListProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="p-4">
        <p className="text-[#92adc9] text-center">
          No hay proyectos para mostrar. Inserta datos en tu tabla 'portafolio' en Supabase.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 p-4">
      {/* Mapeamos los 'items' que vienen de Supabase (como antes)
        pero usamos el NUEVO diseño de tarjeta del HTML
      */}
      {items.map((item) => (
        <div key={item.id} className="flex flex-col gap-3 pb-3">
          <div
            className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg bg-gray-500"
            // Mostramos un 'placeholder' si no hay url_demo
            style={{ backgroundImage: `url(${item.url_demo || 'https://via.placeholder.com/300x160'})` }}
          ></div>
          <div>
            <p className="text-white text-base font-medium leading-normal">
              {item.titulo}
            </p>
            <p className="text-[#92adc9] text-sm font-normal leading-normal">
              {item.descripcion}
            </p>
            {/* Añadimos la sección de 'tecnologías' que SÍ tenemos en Supabase,
              pero que no estaba en el HTML estático.
            */}
            <div className="flex flex-wrap gap-2 mt-2">
              {item.tecnologias.map((tech) => (
                <span key={tech} className="text-xs bg-[#233648] text-[#92adc9] px-2 py-0.5 rounded-full">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;