"use client"; 

import { useFormState, useFormStatus } from 'react-dom';
import { sendContactEmail } from '@/lib/actions';
import React, { useEffect, useRef, useState } from 'react'; // <-- Importa useState

// --- Componente SubmitButton (sin cambios) ---
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

// --- Formulario de Contacto (Actualizado con lógica de Timeout) ---
const ContactForm = () => {
  // 1. 'actionState' es el estado que devuelve la Server Action
  const initialState = { success: false, message: null };
  const [actionState, dispatch] = useFormState(sendContactEmail as any, initialState);
  
  // 2. 'displayState' es el estado local que *mostraremos* al usuario.
  //    Esto nos permite limpiarlo después de un tiempo.
  const [displayState, setDisplayState] = useState(initialState);
  
  const formRef = useRef<HTMLFormElement>(null);

  // 3. useEffect para manejar el mensaje y el temporizador
  useEffect(() => {
    // Cada vez que la Server Action responde, actualizamos el mensaje a mostrar
    if (actionState.message) {
      setDisplayState(actionState);

      // Si fue un ÉXITO...
      if (actionState.success) {
        formRef.current?.reset(); // Limpia el formulario
        
        // ...inicia un temporizador para borrar el mensaje de éxito
        const timer = setTimeout(() => {
          setDisplayState({ success: false, message: null }); // Borra el mensaje
        }, 5000); // 5000ms = 5 segundos

        // Limpia el temporizador si el componente se desmonta
        return () => clearTimeout(timer);
      }
    }
  }, [actionState]); // Este efecto se ejecuta cada vez que 'actionState' cambia

  return (
    <section id="contact" className="scroll-mt-20 mb-10">
      {/* El <h2> se movió a la página page.tsx, 
          así que este componente es solo el formulario */}
      
      <form ref={formRef} action={dispatch} className="space-y-6">
        
        {/* Campo "Nombre" */}
        <div className="flex max-w-xl flex-wrap items-end gap-4">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-slate-700 text-sm font-semibold leading-normal pb-2">Tu Nombre</p>
            <input
              type="text"
              name="name"
              required
              placeholder="Tu nombre completo"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg 
                        text-slate-900 border-slate-300 bg-white 
                        focus:border-blue-500 focus:ring-blue-500
                        h-14 placeholder:text-slate-400 p-[15px] text-base font-normal leading-normal"
            />
          </label>
        </div>

        {/* Campo "Correo Electrónico" */}
        <div className="flex max-w-xl flex-wrap items-end gap-4">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-slate-700 text-sm font-semibold leading-normal pb-2">Tu Correo Electrónico</p>
            <input
              type="email"
              name="email" 
              required
              placeholder="tu_correo@ejemplo.com"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg 
                        text-slate-900 border-slate-300 bg-white 
                        focus:border-blue-500 focus:ring-blue-500
                        h-14 placeholder:text-slate-400 p-[15px] text-base font-normal leading-normal"
            />
          </label>
        </div>

        {/* Campo "Mensaje" */}
        <div className="flex max-w-xl flex-wrap items-end gap-4">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-slate-700 text-sm font-semibold leading-normal pb-2">Mensaje</p>
            <textarea
              name="message" 
              required
              placeholder="Escribe tu mensaje aquí..."
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg 
                        text-slate-900 border-slate-300 bg-white 
                        focus:border-blue-500 focus:ring-blue-500
                        h-14 placeholder:text-slate-400 p-[15px] text-base font-normal leading-normal"
            ></textarea>
          </label>
        </div>
        
        {/* 4. Mensaje de Éxito/Error (Ahora usa 'displayState') */}
        {displayState.message && (
          <div className={`text-sm p-3 rounded-md my-4 max-w-xl ${
            displayState.success // <-- Usa el estado local
              ? 'bg-green-100 border border-green-300 text-green-700' 
              : 'bg-red-50 border border-red-300 text-red-500'
          }`}>
            {displayState.message} {/* <-- Muestra el estado local */}
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