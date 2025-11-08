"use client"; 

import type { EducacionItem } from '@/app/admin/educacion/page';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { deleteEducation } from '@/lib/actions'; // Importa la acción de borrado

interface EducationTableProps {
  educacionItems: EducacionItem[];
}

// Helper para formatear fechas
const formatDate = (dateString: string | null) => {
  if (!dateString) return "Actualidad";
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
  });
};

const EducationTable: React.FC<EducationTableProps> = ({ educacionItems: initialItems }) => {
  const router = useRouter();
  
  const [items, setItems] = useState(initialItems);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingItem, setDeletingItem] = useState<EducacionItem | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleEdit = (id: string) => {
    router.push(`/admin/educacion/${id}`);
  };

  const handleDeleteClick = (item: EducacionItem) => {
    setDeletingItem(item);
    setIsDeleting(true);
    setDeleteError(null);
  };
  
  const handleConfirmDelete = async () => {
    if (!deletingItem) return;

    startTransition(async () => {
      const result = await deleteEducation(deletingItem.id);
      if (result.success) {
        setIsDeleting(false);
        setDeletingItem(null);
        setItems(items.filter(p => p.id !== deletingItem.id));
        router.refresh();
      } else {
        setDeleteError(result.message || 'Error desconocido.');
      }
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
      <h2 className="text-gray-900 text-xl font-semibold mb-4">
        Registros Existentes ({items.length})
      </h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institución</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periodo</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Opciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.titulo}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.institucion}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {formatDate(item.fecha_inicio)} - {formatDate(item.fecha_fin)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button onClick={() => handleEdit(item.id)} className="text-yellow-600 hover:text-yellow-900" disabled={isPending}>
                  Editar
                </button>
                <button onClick={() => handleDeleteClick(item)} className="text-red-600 hover:text-red-900" disabled={isPending}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No hay registros.</td></tr>
          )}
        </tbody>
      </table>

      {/* --- MODAL DE CONFIRMACIÓN DE BORRADO --- */}
      {isDeleting && deletingItem && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmar Eliminación</h3>
            <p className="text-gray-700 mb-4">
              ¿Estás seguro de que quieres eliminar:
              <span className="font-semibold block mt-1">{deletingItem.titulo} en {deletingItem.institucion}</span>?
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

export default EducationTable;