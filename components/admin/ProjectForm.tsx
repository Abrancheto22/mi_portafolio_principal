"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { upsertProject } from '@/lib/actions';
import React from 'react';
import type { PortafolioItem } from '@/app/admin/proyectos/page';

interface ProjectFormProps {
  project?: PortafolioItem; 
}

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
      {pending ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Guardar Proyecto')}
    </button>
  );
}

// ---------------------------------------------
// Componente principal del formulario
// ---------------------------------------------
export default function ProjectForm({ project }: ProjectFormProps) {
  const isEditing = !!project; 
  
  const initialState = { message: null }; 
  const [state, dispatch] = useFormState(upsertProject as any, initialState); 

  const techsString = project?.tecnologias.join(', ') || '';

  return (
    <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
      
      <form action={dispatch} className="space-y-6">
        
        {isEditing && (
            <input type="hidden" name="id" defaultValue={project.id} />
        )}

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