"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { upsertExperience } from '@/lib/actions'; // <--- 1. Importa la nueva Server Action
import React from 'react';
import type { ExperienciaItem } from '@/app/admin/experiencia/page'; // Importa el tipo

// Props: El formulario puede recibir una experiencia (para editar) o ser vacío (para crear)
interface ExperienceFormProps {
  experience?: ExperienciaItem; 
}

// Componente interno para el botón de Submit
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
      {pending ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Guardar Experiencia')}
    </button>
  );
}

// Componente principal del formulario
export default function ExperienceForm({ experience }: ExperienceFormProps) {
  // Determina si estamos editando
  const isEditing = !!experience; 
  
  // 2. Conecta el formulario a la Server Action
  const initialState = { message: null }; 
  const [state, dispatch] = useFormState(upsertExperience as any, initialState); 

  // Helper para formatear fechas para el input tipo 'date' (YYYY-MM-DD)
  const formatDateForInput = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  return (
    <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
      
      {/* 3. El <form> ahora usa la 'action' (dispatch) */}
      <form action={dispatch} className="space-y-6">
        
        {/* Campo oculto para el ID (solo si estamos editando) */}
        {isEditing && (
            <input type="hidden" name="id" defaultValue={experience.id} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Puesto */}
          <div>
            <label htmlFor="puesto" className="block text-sm font-semibold text-gray-700 mb-1">Puesto</label>
            <input
              type="text"
              name="puesto"
              id="puesto"
              required
              className="form-input w-full rounded-lg text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ej: Ingeniero de Software"
              defaultValue={experience?.puesto} // Carga el dato si existe
            />
          </div>
          
          {/* Empresa */}
          <div>
            <label htmlFor="empresa" className="block text-sm font-semibold text-gray-700 mb-1">Empresa</label>
            <input
              type="text"
              name="empresa"
              id="empresa"
              required
              className="form-input w-full rounded-lg text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ej: Google"
              defaultValue={experience?.empresa} // Carga el dato
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
              defaultValue={formatDateForInput(experience?.fecha_inicio)} // Carga y formatea
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
              defaultValue={formatDateForInput(experience?.fecha_fin)} // Carga y formatea
            />
          </div>
        </div>
        
        {/* Descripción */}
        <div>
          <label htmlFor="descripcion" className="block text-sm font-semibold text-gray-700 mb-1">Descripción de Tareas</label>
          <textarea
            name="descripcion"
            id="descripcion"
            rows={4}
            required
            className="form-input w-full rounded-lg text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Describe tus responsabilidades y logros..."
            defaultValue={experience?.descripcion} // Carga el dato
          />
        </div>

        {/* 4. Mensaje de error (si algo falla) */}
        {state?.message && (
          <div className="text-red-500 text-sm p-3 bg-red-50 border border-red-300 rounded-md">
            {state.message}
          </div>
        )}

        {/* 5. El botón de Enviar ahora es un componente separado */}
        <div className="pt-4">
          <SubmitButton isEditing={isEditing} />
        </div>
      </form>
    </div>
  );
}