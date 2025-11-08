"use client"; 

import type { HabilidadItem } from '@/app/admin/habilidades/page';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { deleteSkill } from '@/lib/actions'; // Importa la acción de borrado

interface SkillsTableProps {
  habilidades: HabilidadItem[];
}

const SkillsTable: React.FC<SkillsTableProps> = ({ habilidades: initialItems }) => {
  const router = useRouter();
  
  const [items, setItems] = useState(initialItems);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingItem, setDeletingItem] = useState<HabilidadItem | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleEdit = (id: string) => {
    router.push(`/admin/habilidades/${id}`);
  };

  const handleDeleteClick = (item: HabilidadItem) => {
    setDeletingItem(item);
    setIsDeleting(true);
    setDeleteError(null);
  };
  
  const handleConfirmDelete = async () => {
    if (!deletingItem) return;

    startTransition(async () => {
      const result = await deleteSkill(deletingItem.id);
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
        Habilidades Registradas ({items.length})
      </h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo (Opcional)</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Opciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.nombre}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.tipo || 'N/A'}</td>
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
            <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-500">No hay habilidades.</td></tr>
          )}
        </tbody>
      </table>

      {/* --- MODAL DE CONFIRMACIÓN DE BORRADO --- */}
      {isDeleting && deletingItem && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmar Eliminación</h3>
            <p className="text-gray-700 mb-4">
              ¿Estás seguro de que quieres eliminar la habilidad:
              <span className="font-semibold block mt-1">{deletingItem.nombre}</span>?
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

export default SkillsTable;