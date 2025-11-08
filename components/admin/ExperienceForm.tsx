"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { upsertExperience } from '@/lib/actions'; // <--- 1. Importa la nueva Server Action
import React, { useState, useEffect } from 'react';
import type { ExperienciaItem } from '@/app/admin/experiencia/page'; // Importa el tipo
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const isEditing = !!experience; 
  const initialState = { success: false, message: null };
  const [state, dispatch] = useFormState(upsertExperience as any, initialState); 

  // --- AÑADE ESTE HOOK ---
  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        router.push('/admin/experiencia'); // Redirige a la tabla de experiencia
      }, 1500); 
      return () => clearTimeout(timer);
    }
  }, [state.success, router]);
  // --- FIN DEL HOOK ---

  const formatDateForInput = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  return (
    <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
      
      <form action={dispatch} className="space-y-6">
        
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

        {/* --- CAMPO DE ESTADO (CHECKBOX) --- */}
      <div>
        <label htmlFor="estado" className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="estado"
            id="estado"
            className="form-checkbox h-5 w-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
            defaultChecked={experience?.estado ?? true} 
          />
          <span className="text-sm font-semibold text-gray-700">
            Activo (Mostrar en el portafolio público)
          </span>
        </label>
      </div>

        {/* Mensaje de Estado (Éxito/Error) */}
        {state?.message && (
          <div className={`text-sm p-3 rounded-md ${
            state.success ? 'bg-green-100 border border-green-300 text-green-700' : 'bg-red-50 border border-red-300 text-red-500'
          }`}>
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