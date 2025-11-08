"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { updateProfile } from '@/lib/actions';
import React, { useEffect, useState } from 'react';
import type { PerfilItem } from '@/app/admin/sobre-mi/page';

interface ProfileFormProps {
  profile: PerfilItem; 
}

// Botón de Submit (sin cambios)
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
                   : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl hover:scale-105'
                 }`}
    >
      {pending ? 'Guardando...' : 'Guardar Cambios'}
    </button>
  );
}

// Formulario principal (CON ESTILOS MEJORADOS)
export default function ProfileForm({ profile }: ProfileFormProps) {
  
  const [state, dispatch] = useFormState(updateProfile as any, { success: false, message: null });
  const [showSuccess, setShowSuccess] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(profile.url_foto_perfil);

  useEffect(() => {
    if (state.success) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setImagePreviewUrl(profile.url_foto_perfil);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
      <form action={dispatch} className="space-y-6">

        {/* Pasamos la URL existente en un campo oculto */}
        <input type="hidden" name="url_foto_perfil_existente" defaultValue={profile.url_foto_perfil || ''} />

        {/* Nombre Completo */}
        <div>
          <label htmlFor="nombre_completo" className="block text-sm font-semibold text-gray-700 mb-2">
            Nombre Completo
          </label>
          <input
            type="text"
            name="nombre_completo"
            id="nombre_completo"
            required
            className="form-input w-full rounded-lg text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
            defaultValue={profile.nombre_completo}
          />
        </div>
        
        {/* Título */}
        <div>
          <label htmlFor="titulo" className="block text-sm font-semibold text-gray-700 mb-2">
            Título
          </label>
          <input
            type="text"
            name="titulo"
            id="titulo"
            required
            className="form-input w-full rounded-lg text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
            defaultValue={profile.titulo}
          />
        </div>

        {/* Ubicación */}
        <div>
          <label htmlFor="ubicacion" className="block text-sm font-semibold text-gray-700 mb-2">
            Ubicación
          </label>
          <input
            type="text"
            name="ubicacion"
            id="ubicacion"
            required
            className="form-input w-full rounded-lg text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
            defaultValue={profile.ubicacion}
          />
        </div>

        {/* Campo de Subida de Imagen (Con Estilos) */}
        <div>
          <label htmlFor="file_foto_perfil" className="block text-sm font-semibold text-gray-700 mb-2">
            Subir Foto de Perfil (JPG, PNG, WEBP)
          </label>
          <input
            type="file"
            name="file_foto_perfil"
            id="file_foto_perfil"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100 file:cursor-pointer"
          />
          {imagePreviewUrl && (
            <div className="mt-4 flex items-center space-x-4">
              <img src={imagePreviewUrl} alt="Previsualización" className="w-24 h-24 rounded-full object-cover border border-gray-200" />
              {imagePreviewUrl !== profile.url_foto_perfil && (
                <p className="text-sm text-gray-600">Nueva imagen seleccionada.</p>
              )}
            </div>
          )}
        </div>
        
        {/* Acerca de (Textarea) */}
        <div>
          <label htmlFor="acerca_de" className="block text-sm font-semibold text-gray-700 mb-2">
            Párrafo "Acerca de Mí"
          </label>
          <textarea
            name="acerca_de"
            id="acerca_de"
            rows={6}
            required
            className="form-textarea w-full rounded-lg text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
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