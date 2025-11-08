"use client"; 

import type { PortafolioItem } from '@/app/admin/proyectos/page';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { deleteProject } from '@/lib/actions';

interface ProjectsTableProps {
  proyectos: PortafolioItem[];
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ proyectos: initialProjects }) => {
  const router = useRouter();
  
  const [proyectos, setProyectos] = useState(initialProjects);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingItem, setDeletingItem] = useState<PortafolioItem | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleEdit = (id: string) => {
    router.push(`/admin/proyectos/${id}`);
  };

  const handleDeleteClick = (proyecto: PortafolioItem) => {
    setDeletingItem(proyecto);
    setIsDeleting(true);
    setDeleteError(null);
  };
  
  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    startTransition(async () => {
      const result = await deleteProject(deletingItem.id);
      if (result.success) {
        setIsDeleting(false);
        setDeletingItem(null);
        setProyectos(proyectos.filter(p => p.id !== deletingItem.id));
        router.refresh(); 
      } else {
        setDeleteError(result.message || 'Error desconocido.');
      }
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <h2 className="text-gray-900 text-xl font-semibold p-6">
        Proyectos Existentes ({proyectos.length})
      </h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Título
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Tecnologías
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                GitHub
              </th>
              <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Opciones
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {proyectos.map((proyecto) => (
              <tr key={proyecto.id} className="odd:bg-white even:bg-slate-50 hover:bg-blue-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {proyecto.titulo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {proyecto.tecnologias.join(', ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <a href={proyecto.url_github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Ver Repo
                  </a>
                </td>
                
                {/* --- CAMBIO DE ESTILO AQUÍ --- */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(proyecto.id)}
                    className="px-4 py-2 rounded-lg font-semibold text-sm {/* <-- Más grande */}
                               bg-yellow-100 text-yellow-800 
                               hover:bg-yellow-200 transition-colors duration-150"
                    disabled={isPending}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteClick(proyecto)}
                    className="px-4 py-2 rounded-lg font-semibold text-sm {/* <-- Más grande */}
                               bg-red-100 text-red-800 
                               hover:bg-red-200 transition-colors duration-150"
                    disabled={isPending}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {proyectos.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No hay proyectos. ¡Añade uno!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODAL (Sin cambios) --- */}
      {isDeleting && deletingItem && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmar Eliminación</h3>
            {/* ... (contenido del modal sin cambios) ... */}
            <p className="text-gray-700 mb-4">
              ¿Estás seguro de que quieres eliminar el proyecto:
              <span className="font-semibold block mt-1">{deletingItem.titulo}</span>?
            </p>
            {deleteError && (
              <div className="text-red-600 text-sm mb-4 border border-red-200 p-2 rounded">Error: {deleteError}</div>
            )}
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setIsDeleting(false)} disabled={isPending} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50">
                Cancelar
              </button>
              <button onClick={handleConfirmDelete} disabled={isPending} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold disabled:bg-red-400">
                {isPending ? 'Eliminando...' : 'Sí, Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsTable;