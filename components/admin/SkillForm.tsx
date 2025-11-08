"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { upsertSkill } from '@/lib/actions'; // Importa la Server Action
import React from 'react';
import type { HabilidadItem } from '@/app/admin/habilidades/page';

interface SkillFormProps {
  skill?: HabilidadItem; 
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
      {pending ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Guardar Habilidad')}
    </button>
  );
}

// Formulario principal
export default function SkillForm({ skill }: SkillFormProps) {
  const isEditing = !!skill; 
  const initialState = { message: null }; 
  const [state, dispatch] = useFormState(upsertSkill as any, initialState); 

  return (
    <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
      <form action={dispatch} className="space-y-6">
        
        {isEditing && (
            <input type="hidden" name="id" defaultValue={skill.id} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              id="nombre"
              required
              className="form-input w-full rounded-lg text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ej: React"
              defaultValue={skill?.nombre}
            />
          </div>
          
          {/* Tipo (Opcional) */}
          <div>
            <label htmlFor="tipo" className="block text-sm font-semibold text-gray-700 mb-1">Tipo (Opcional)</label>
            <input
              type="text"
              name="tipo"
              id="tipo"
              className="form-input w-full rounded-lg text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ej: Frontend"
              defaultValue={skill?.tipo || ''}
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