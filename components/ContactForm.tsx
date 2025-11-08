"use client"; 

import { useFormState, useFormStatus } from 'react-dom';
import { sendContactEmail } from '@/lib/actions'; // <-- Importa la nueva acción
import React, { useEffect, useRef } from 'react';

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
                   : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl hover:scale-105'
                 }`}
    >
      {pending ? 'Enviando...' : 'Enviar Mensaje'}
    </button>
  );
}

// Formulario de Contacto
const ContactForm = () => {
  const initialState = { success: false, message: null };
  const [state, dispatch] = useFormState(sendContactEmail as any, initialState);
  const formRef = useRef<HTMLFormElement>(null); // Ref para resetear el formulario

  // Resetea el formulario si el envío fue exitoso
  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <section id="contact" className="scroll-mt-20 mb-10">
      <h2 className="text-slate-900 text-3xl font-bold px-4 pb-3 pt-5 border-b-2 border-blue-500 mb-6">
        Contacto
      </h2>
      
      {/* Conecta el <form> a la Server Action */}
      <form ref={formRef} action={dispatch} className="px-4">
        <div className="flex max-w-xl flex-wrap items-end gap-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-slate-700 text-sm font-semibold leading-normal pb-2">Tu Correo Electrónico</p>
            <input
              type="email"
              name="email" // <-- El 'name' debe coincidir con el formData.get()
              required
              placeholder="tu_correo@ejemplo.com"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg 
                         text-slate-900 border-slate-300 bg-white 
                         focus:border-blue-500 focus:ring-blue-500
                         h-14 placeholder:text-slate-400 p-[15px] text-base font-normal leading-normal"
            />
          </label>
        </div>
        <div className="flex max-w-xl flex-wrap items-end gap-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-slate-700 text-sm font-semibold leading-normal pb-2">Mensaje</p>
            <textarea
              name="message" // <-- El 'name' debe coincidir con el formData.get()
              required
              placeholder="Escribe tu mensaje aquí..."
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg 
                         text-slate-900 border-slate-300 bg-white 
                         focus:border-blue-500 focus:ring-blue-500
                         min-h-36 placeholder:text-slate-400 p-[15px] text-base font-normal leading-normal"
            ></textarea>
          </label>
        </div>
        
        {/* Mensaje de Éxito/Error */}
        {state?.message && (
          <div className={`text-sm p-3 rounded-md my-4 max-w-xl ${
            state.success 
              ? 'bg-green-100 border border-green-300 text-green-700' 
              : 'bg-red-50 border border-red-300 text-red-500'
          }`}>
            {state.message}
          </div>
        )}

        <div className="flex px-0 py-3">
          <SubmitButton />
        </div>
      </form>
    </section>
  );
};

export default ContactForm;