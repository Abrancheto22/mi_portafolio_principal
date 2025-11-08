"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { upsertProject } from '@/lib/actions';
import React, { useState, useEffect } from 'react';
import type { PortafolioItem } from '@/app/admin/proyectos/page';
import { useRouter } from 'next/navigation';

interface ProjectFormProps {
  project?: PortafolioItem; 
}

// Botón de Submit (sin cambios)
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

// Formulario principal (CON CAMBIOS DE ESTILO)
export default function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const isEditing = !!project; 
  const initialState = { success: false, message: null }; 
  const [state, dispatch] = useFormState(upsertProject as any, initialState); 

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(project?.image_url || null);
  const techsString = project?.tecnologias.join(', ') || '';

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        router.push('/admin/proyectos');
      }, 1500); 
      return () => clearTimeout(timer);
    }
  }, [state.success, router]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setImagePreviewUrl(project?.image_url || null);
    }
  };

  return (
    // CONTENEDOR DEL FORMULARIO
    <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
      <form action={dispatch} className="space-y-6">
        
        {isEditing && (
            <input type="hidden" name="id" defaultValue={project.id} />
        )}
        <input type="hidden" name="image_url_existente" defaultValue={project?.image_url || ''} />

        {/* Título (Ahora visible) */}
        <div>
          <label htmlFor="titulo" className="block text-sm font-semibold text-gray-700 mb-2">
            Título
          </label>
          <input
            type="text" name="titulo" id="titulo" required
            // La clase 'form-input' ahora funcionará gracias al plugin
            className="form-input w-full rounded-lg text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
            placeholder="Mi Increíble Proyecto"
            defaultValue={project?.titulo} 
          />
        </div>

        {/* Campo de Subida de Imagen (Con Estilos) */}
        <div>
          <label htmlFor="file_proyecto" className="block text-sm font-semibold text-gray-700 mb-2">
            Imagen del Proyecto (JPG, PNG, WEBP)
          </label>
          <input
            type="file"
            name="file_proyecto"
            id="file_proyecto"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            // Estas clases estilizan el botón "Seleccionar archivo"
            className="block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100 file:cursor-pointer"
          />
          {imagePreviewUrl && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Previsualización:</p>
              <img src={imagePreviewUrl} alt="Previsualización" className="w-full max-w-xs h-auto rounded-lg object-cover border border-gray-200" />
            </div>
          )}
        </div>
        
        {/* Descripción (Ahora visible) */}
        <div>
          <label htmlFor="descripcion" className="block text-sm font-semibold text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            name="descripcion" id="descripcion" rows={4} required
            // La clase 'form-textarea' ahora funcionará
            className="form-textarea w-full rounded-lg text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
            defaultValue={project?.descripcion} 
            placeholder="Describe tu proyecto aquí..."
          />
        </div>
        
        {/* Tecnologías (Ahora visible) */}
        <div>
          <label htmlFor="tecnologias" className="block text-sm font-semibold text-gray-700 mb-2">
            Tecnologías (separadas por coma)
          </label>
          <input
            type="text" name="tecnologias" id="tecnologias" required
            className="form-input w-full rounded-lg text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
            defaultValue={techsString} 
            placeholder="React, Next.js, Supabase"
          />
        </div>

        {/* URLs (Ahora visible) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="url_demo" className="block text-sm font-semibold text-gray-700 mb-2">
              URL Demo (Opcional)
            </label>
            <input
              type="url" name="url_demo" id="url_demo"
              className="form-input w-full rounded-lg text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
              defaultValue={project?.url_demo || ''} 
              placeholder="https://mi-demo.com"
            />
          </div>
          <div>
            <label htmlFor="url_github" className="block text-sm font-semibold text-gray-700 mb-2">
              URL GitHub
            </label>
            <input
              type="url" name="url_github" id="url_github" required
              className="form-input w-full rounded-lg text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
              defaultValue={project?.url_github} 
              placeholder="https://github.com/tu-usuario/repo"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="estado" className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="estado"
              id="estado"
              className="form-checkbox h-5 w-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
              defaultChecked={project?.estado ?? true} 
            />
            <span className="text-sm font-semibold text-gray-700">
              Activo (Mostrar en el portafolio público)
            </span>
          </label>
        </div>

        {/* Mensaje de Error (sin cambios) */}
        {state?.message && (
          <div className={`text-sm p-3 rounded-md ${
            state.success 
              ? 'bg-green-100 border border-green-300 text-green-700' 
              : 'bg-red-50 border border-red-300 text-red-500'
          }`}>
            {state.message}
          </div>
        )}

        {/* Botón de Submit (sin cambios) */}
        <div className="pt-4">
          <SubmitButton isEditing={isEditing} />
        </div>
      </form>
    </div>
  );
}