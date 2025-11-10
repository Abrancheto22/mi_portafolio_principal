"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { upsertSocialLink } from '@/lib/actions';
import React, { useEffect } from 'react';
import type { SocialLinkItem } from '@/app/admin/redes/page';
import { useRouter } from 'next/navigation';

interface SocialLinkFormProps { socialLink?: SocialLinkItem; }

// ---------------------------------------------
// Componente interno para el botón de Submit
// (CON LOS ESTILOS DE GRADIENTE)
// ---------------------------------------------
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
      {pending ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Guardar Red Social')}
    </button>
  );
}

// ---------------------------------------------
// Formulario principal
// ---------------------------------------------
export default function SocialLinkForm({ socialLink }: SocialLinkFormProps) {
  const router = useRouter();
  const isEditing = !!socialLink; 
  const initialState = { success: false, message: null }; 
  const [state, dispatch] = useFormState(upsertSocialLink as any, initialState); 

  // --- AÑADE ESTE HOOK ---
  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        router.push('/admin/redes'); // Redirige a la tabla de redes
      }, 1500); 
      return () => clearTimeout(timer);
    }
  }, [state.success, router]);
  // --- FIN DEL HOOK ---

  return (
    <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
      <form action={dispatch} className="space-y-6">
        
        {isEditing && ( <input type="hidden" name="id" defaultValue={socialLink.id} /> )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
            <input
              type="text" name="nombre" id="nombre" required
              className="form-input w-full rounded-lg text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
              placeholder="Ej: GitHub"
              defaultValue={socialLink?.nombre}
            />
          </div>
          
          {/* URL */}
          <div>
            <label htmlFor="url" className="block text-sm font-semibold text-gray-700 mb-2">URL</label>
            <input
              type="url" name="url" id="url" required
              className="form-input w-full rounded-lg text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
              placeholder="https://github.com/tu-usuario"
              defaultValue={socialLink?.url}
            />
          </div>
        </div>

        {/* Campo de Estado (Checkbox) */}
        <div>
          <label htmlFor="estado" className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="estado"
              id="estado"
              className="form-checkbox h-5 w-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
              defaultChecked={isEditing ? socialLink.estado : true} // Activo por defecto al crear
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

        <div className="pt-4">
          <SubmitButton isEditing={isEditing} />
        </div>
      </form>
    </div>
  );
}