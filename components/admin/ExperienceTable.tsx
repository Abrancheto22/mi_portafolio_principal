"use client"; 

import type { ExperienciaItem } from '@/app/admin/experiencia/page';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { deleteExperience } from '@/lib/actions'; // <-- IMPORTA LA ACCIÓN

interface ExperienceTableProps {
  experiencias: ExperienciaItem[];
}

// Helper para formatear fechas
const formatDate = (dateString: string | null) => {
  if (!dateString) return "Actualidad";
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
  });
};

const ExperienceTable: React.FC<ExperienceTableProps> = ({ experiencias: initialExperiencias }) => {
  const router = useRouter();
  
  // 1. Estado para la lista (para borrar sin recargar)
  const [experiencias, setExperiencias] = useState(initialExperiencias);
  
  // 2. Estado para el Modal de Borrado
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingItem, setDeletingItem] = useState<ExperienciaItem | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleEdit = (id: string) => {
    router.push(`/admin/experiencia/${id}`);
  };

  const handleDeleteClick = (experiencia: ExperienciaItem) => {
    // Abre el modal y guarda el ítem a borrar
    setDeletingItem(experiencia);
    setIsDeleting(true);
    setDeleteError(null); // Limpia errores previos
  };
  
  const handleConfirmDelete = async () => {
    if (!deletingItem) return;

    startTransition(async () => {
      // 3. Llama a la nueva Server Action
      const result = await deleteExperience(deletingItem.id);

      if (result.success) {
        // Éxito: Cierra el modal y actualiza la lista en el cliente
        setIsDeleting(false);
        setDeletingItem(null);
        setExperiencias(experiencias.filter(p => p.id !== deletingItem.id));
        router.refresh(); // Sincroniza con el servidor
      } else {
        // Error: Muestra el mensaje en el modal
        setDeleteError(result.message || 'Error desconocido al eliminar.');
      }
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
      <h2 className="text-gray-900 text-xl font-semibold mb-4">
        Experiencias Existentes ({experiencias.length})
      </h2>
      <table className="min-w-full divide-y divide-gray-200">
        {/* ... (thead de la tabla - sin cambios) ... */}
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puesto</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periodo</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Opciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {experiencias.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.puesto}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.empresa}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {formatDate(item.fecha_inicio)} - {formatDate(item.fecha_fin)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button
                  onClick={() => handleEdit(item.id)}
                  className="text-yellow-600 hover:text-yellow-900"
                  disabled={isPending}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteClick(item)} // Llama a la función del modal
                  className="text-red-600 hover:text-red-900"
                  disabled={isPending}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {/* ... (fila de 'No hay experiencias' - sin cambios) ... */}
        </tbody>
      </table>

      {/* --- MODAL DE CONFIRMACIÓN DE BORRADO --- */}
      {isDeleting && deletingItem && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Confirmar Eliminación
            </h3>
            <p className="text-gray-700 mb-4">
              ¿Estás seguro de que quieres eliminar la experiencia:
              <span className="font-semibold block mt-1">{deletingItem.puesto} en {deletingItem.empresa}</span>?
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
                disabled={isPending}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold disabled:bg-red-400"
              >
                {isPending ? 'Eliminando...' : 'Sí, Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --- FIN DEL MODAL --- */}
    </div>
  );
};

export default ExperienceTable;