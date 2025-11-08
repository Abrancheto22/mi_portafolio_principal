"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { updateProfile } from '@/lib/actions';
import React, { useEffect, useState } from 'react';
import type { PerfilItem } from '@/app/admin/sobre-mi/page';

interface ProfileFormProps {
  profile: PerfilItem;
}

// Botón de Submit
function SubmitButton() {
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
      {pending ? 'Guardando...' : 'Guardar Cambios'}
    </button>
  );
}

// Formulario principal
export default function ProfileForm({ profile }: ProfileFormProps) {
  
  // Estado para el mensaje de éxito
  const [state, dispatch] = useFormState(updateProfile as any, { success: false, message: null });
  const [showSuccess, setShowSuccess] = useState(false);

  // Muestra el mensaje de "éxito" por 3 segundos
  useEffect(() => {
    if (state.success) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  return (
    <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
      <form action={dispatch} className="space-y-6">

        {/* Nombre Completo */}
        <div>
          <label htmlFor="nombre_completo" className="block text-sm font-semibold text-gray-700 mb-1">Nombre Completo</label>
          <input
            type="text"
            name="nombre_completo"
            id="nombre_completo"
            required
            className="form-input w-full rounded-lg text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            defaultValue={profile.nombre_completo}
          />
        </div>
        
        {/* Título */}
        <div>
          <label htmlFor="titulo" className="block text-sm font-semibold text-gray-700 mb-1">Título</label>
          <input
            type="text"
            name="titulo"
            id="titulo"
            required
            className="form-input w-full rounded-lg text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            defaultValue={profile.titulo}
          />
        </div>

        {/* Ubicación */}
        <div>
          <label htmlFor="ubicacion" className="block text-sm font-semibold text-gray-700 mb-1">Ubicación</label>
          <input
            type="text"
            name="ubicacion"
            id="ubicacion"
            required
            className="form-input w-full rounded-lg text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            defaultValue={profile.ubicacion}
          />
        </div>

        {/* URL Foto de Perfil */}
        <div>
          <label htmlFor="url_foto_perfil" className="block text-sm font-semibold text-gray-700 mb-1">URL Foto de Perfil (Opcional)</label>
          <input
            type="url"
            name="url_foto_perfil"
            id="url_foto_perfil"
            className="form-input w-full rounded-lg text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            defaultValue={profile.url_foto_perfil || ''}
          />
        </div>
        
        {/* Acerca de (Textarea) */}
        <div>
          <label htmlFor="acerca_de" className="block text-sm font-semibold text-gray-700 mb-1">Párrafo "Acerca de Mí"</label>
          <textarea
            name="acerca_de"
            id="acerca_de"
            rows={6}
            required
            className="form-input w-full rounded-lg text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            defaultValue={profile.acerca_de}
          />
        </div>
        
        {/* Mensaje de Error/Éxito */}
        {state?.message && (
          <div className={`text-sm p-3 rounded-md ${
            state.success ? 'bg-green-100 border border-green-300 text-green-700' : 'bg-red-50 border border-red-300 text-red-500'
          }`}>
            {state.message}
          </div>
        )}
        
        {/* Mensaje de Éxito temporal (si el 'state' se resetea) */}
        {showSuccess && !state.message && (
           <div className="text-sm p-3 rounded-md bg-green-100 border border-green-300 text-green-700">
             ¡Perfil actualizado con éxito!
           </div>
        )}

        <div className="pt-4">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}