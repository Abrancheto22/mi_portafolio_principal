"use client"; // <--- ¡Importante! Para los botones de Edit/Delete

import type { PortafolioItem } from '@/app/admin/proyectos/page'; // Importamos el tipo
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteProject } from '@/lib/actions';

interface ProjectsTableProps {
  proyectos: PortafolioItem[];
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ proyectos: initialProjects}) => {
  const router = useRouter();

  // 1. Estado para la lista (se usará para borrar sin recargar)
  const [proyectos, setProyectos] = useState(initialProjects);

  // 2. Estado para el Modal
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingItem, setDeletingItem] = useState<PortafolioItem | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    // Redirige a la página de edición (que crearemos en el próximo paso)
    router.push(`/admin/proyectos/${id}`);
  };

  // La función handleDeleteClick (modificar):
  const handleDeleteClick = (proyecto: PortafolioItem) => {
    setDeletingItem(proyecto); // Guarda el proyecto a borrar
    setIsDeleting(true);       // Abre el modal
    setDeleteError(null);
  };
  
  // 3. La función de borrado final
  const handleConfirmDelete = async () => {
    if (!deletingItem) return;

    // Llama a la Server Action
    const result = await deleteProject(deletingItem.id);

    if (result.success) {
      // Si fue exitoso, actualiza la lista en el cliente (sin recargar la página)
      setProyectos(proyectos.filter(p => p.id !== deletingItem.id));
      setIsDeleting(false);
      setDeletingItem(null);
      // Redirigir y forzar el refresco de los datos del servidor para sincronizar
      router.refresh(); 
    } else {
      setDeleteError(result.message || 'Error desconocido al eliminar.');
    }
  };
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
      <h2 className="text-gray-900 text-xl font-semibold mb-4">
        Proyectos Existentes ({proyectos.length})
      </h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tecnologías</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GitHub</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Opciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {proyectos.map((proyecto) => (
            <tr key={proyecto.id} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{proyecto.titulo}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{proyecto.tecnologias.join(', ')}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                <a href={proyecto.url_github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Ver Repo
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button
                  onClick={() => handleEdit(proyecto.id)}
                  className="text-yellow-600 hover:text-yellow-900"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteClick(proyecto)}
                  className="text-red-600 hover:text-red-900"
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

      {/* --- MODAL DE CONFIRMACIÓN DE BORRADO --- */}
      {isDeleting && deletingItem && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Confirmar Eliminación
            </h3>
            <p className="text-gray-700 mb-4">
              ¿Estás seguro de que quieres eliminar el proyecto:
              <span className="font-semibold block mt-1">{deletingItem.titulo}</span>?
              Esta acción no se puede deshacer.
            </p>
            
            {deleteError && (
              <div className="text-red-600 text-sm mb-4 border border-red-200 p-2 rounded">
                Error: {deleteError}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsDeleting(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --- FIN DEL MODAL --- */}
    </div>
  );
};

export default ProjectsTable;