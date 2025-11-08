"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { upsertEducation } from '@/lib/actions'; // Importa la Server Action
import React from 'react';
import type { EducacionItem } from '@/app/admin/educacion/page';

interface EducationFormProps {
  education?: EducacionItem; 
}

// Botón de Submit
function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus(); 
  return (
    <button
      type="submit"
      disabled={pending}
      className={`flex min-w-[150px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 
                 text-white text-base font-bold shadow-lg transition-all duration-200
                 ${pending 
                   ? 'bg-gray-400 cursor-not-allowed' 
                   : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-xl hover:scale-105'
                 }`}
    >
      {pending ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Guardar Educación')}
    </button>
  );
}

// Formulario principal
export default function EducationForm({ education }: EducationFormProps) {
  const isEditing = !!education; 
  const initialState = { message: null }; 
  const [state, dispatch] = useFormState(upsertEducation as any, initialState); 

  const formatDateForInput = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  return (
    <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
      <form action={dispatch} className="space-y-6">
        
        {isEditing && (
            <input type="hidden" name="id" defaultValue={education.id} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Título */}
          <div>
            <label htmlFor="titulo" className="block text-sm font-semibold text-gray-700 mb-1">Título / Grado</label>
            <input
              type="text"
              name="titulo"
              id="titulo"
              required
              className="form-input w-full rounded-lg text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ej: Bachiller en Ingeniería de Sistemas"
              defaultValue={education?.titulo}
            />
          </div>
          
          {/* Institución */}
          <div>
            <label htmlFor="institucion" className="block text-sm font-semibold text-gray-700 mb-1">Institución</label>
            <input
              type="text"
              name="institucion"
              id="institucion"
              required
              className="form-input w-full rounded-lg text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ej: Universidad Nacional de Trujillo"
              defaultValue={education?.institucion}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fecha Inicio */}
          <div>
            <label htmlFor="fecha_inicio" className="block text-sm font-semibold text-gray-700 mb-1">Fecha de Inicio</label>
            <input
              type="date"
              name="fecha_inicio"
              id="fecha_inicio"
              required
              className="form-input w-full rounded-lg text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              defaultValue={formatDateForInput(education?.fecha_inicio)}
            />
          </div>
          
          {/* Fecha Fin (Opcional) */}
          <div>
            <label htmlFor="fecha_fin" className="block text-sm font-semibold text-gray-700 mb-1">Fecha de Fin (Dejar vacío si es actual)</label>
            <input
              type="date"
              name="fecha_fin"
              id="fecha_fin"
              className="form-input w-full rounded-lg text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              defaultValue={formatDateForInput(education?.fecha_fin)}
            />
          </div>
        </div>

        {state?.message && (
          <div className="text-red-500 text-sm p-3 bg-red-50 border border-red-300 rounded-md">
            {state.message}
          </div>
        )}

        <div className="pt-4">
          <SubmitButton isEditing={isEditing} />
        </div>
      </form>
    </div>
  );
}