"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { upsertProject } from '@/lib/actions'; // <-- Importa la Server Action unificada
import React from 'react';
import type { PortafolioItem } from '@/app/admin/proyectos/page'; // Importa el tipo de dato

// Props: El formulario puede recibir un proyecto (para editar) o ser vacío (para crear)
interface ProjectFormProps {
  project?: PortafolioItem; 
}

// ---------------------------------------------
// Componente interno para el botón de Submit
// ---------------------------------------------
function SubmitButton({ isEditing }: { isEditing: boolean }) {
  // Este hook SÓLO funciona si es hijo de un <form> con action
  const { pending } = useFormStatus(); 

  return (
    <button
      type="submit"
      disabled={pending} // Deshabilita el botón mientras se guarda
      className={`flex min-w-[150px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 text-white text-base font-bold transition-colors duration-200 ${
        pending 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      {pending ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Guardar Proyecto')}
    </button>
  );
}

// ---------------------------------------------
// Componente principal del formulario
// ---------------------------------------------
export default function ProjectForm({ project }: ProjectFormProps) {
  // Determina si estamos editando (si recibimos un proyecto)
  const isEditing = !!project; 
  
  // Conecta al Server Action (usamos el mismo para crear y actualizar)
  const initialState = { message: null }; 
  const [state, dispatch] = useFormState(upsertProject as any, initialState); 

  // Helper para convertir el array de tecnologías a un string separado por comas para el defaultValue
  const techsString = project?.tecnologias.join(', ') || '';

  return (
    <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
      
      {/* El <form> ahora usa la 'action' (dispatch) */}
      <form action={dispatch} className="space-y-6">
        
        {/* Campo oculto para el ID (sólo si estamos editando) */}
        {isEditing && (
            <input type="hidden" name="id" defaultValue={project.id} />
        )}

        {/* Título */}
        <div>
          <label htmlFor="titulo" className="block text-sm font-semibold text-gray-700 mb-1">
            Título
          </label>
          <input
            type="text"
            name="titulo"
            id="titulo"
            required
            className="form-input w-full rounded-lg text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Mi Increíble Proyecto"
            defaultValue={project?.titulo} 
          />
        </div>
        
        {/* Descripción */}
        <div>
          <label htmlFor="descripcion" className="block text-sm font-semibold text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            name="descripcion"
            id="descripcion"
            rows={4}
            required
            className="form-input w-full rounded-lg text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            defaultValue={project?.descripcion} 
            placeholder="Describe tu proyecto aquí..."
          />
        </div>
        
        {/* Tecnologías (separadas por coma) */}
        <div>
          <label htmlFor="tecnologias" className="block text-sm font-semibold text-gray-700 mb-1">
            Tecnologías (separadas por coma)
          </label>
          <input
            type="text"
            name="tecnologias"
            id="tecnologias"
            required
            className="form-input w-full rounded-lg text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            defaultValue={techsString} 
            placeholder="React, Next.js, Supabase"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* URL Demo */}
          <div>
            <label htmlFor="url_demo" className="block text-sm font-semibold text-gray-700 mb-1">
              URL Demo (Opcional)
            </label>
            <input
              type="url"
              name="url_demo"
              id="url_demo"
              className="form-input w-full rounded-lg text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              defaultValue={project?.url_demo || ''} 
              placeholder="https://mi-demo.com"
            />
          </div>
          
          {/* URL GitHub */}
          <div>
            <label htmlFor="url_github" className="block text-sm font-semibold text-gray-700 mb-1">
              URL GitHub
            </label>
            <input
              type="url"
              name="url_github"
              id="url_github"
              required
              className="form-input w-full rounded-lg text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              defaultValue={project?.url_github} 
              placeholder="https://github.com/tu-usuario/repo"
            />
          </div>
        </div>

        {/* Mensaje de error (si algo falla) */}
        {state?.message && (
          <div className="text-red-500 text-sm p-3 bg-red-50 border border-red-300 rounded-md">
            {state.message}
          </div>
        )}

        {/* Botón de Enviar */}
        <div className="pt-4">
          <SubmitButton isEditing={isEditing} />
        </div>
      </form>
    </div>
  );
}