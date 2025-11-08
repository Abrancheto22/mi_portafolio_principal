"use client"; 

import React from 'react';

const ContactForm = () => {
  return (
    <section id="contact" className="scroll-mt-20 mb-10">
      <h2 className="text-slate-900 text-3xl font-bold px-4 pb-3 pt-5 border-b-2 border-blue-500 mb-6">
        Contacto
      </h2>
      
      <form className="px-4">
        <div className="flex max-w-xl flex-wrap items-end gap-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-slate-700 text-sm font-semibold leading-normal pb-2">Correo Electrónico</p>
            <input
              type="email"
              name="email"
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
              name="message"
              placeholder="Escribe tu mensaje aquí"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg 
                         text-slate-900 border-slate-300 bg-white 
                         focus:border-blue-500 focus:ring-blue-500
                         min-h-36 placeholder:text-slate-400 p-[15px] text-base font-normal leading-normal"
            ></textarea>
          </label>
        </div>
        <div className="flex px-0 py-3">
          {/* --- BOTÓN CON GRADIENTE --- */}
          <button 
            type="submit" 
            className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 
                       bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold
                       shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            onClick={(e) => e.preventDefault()}
          >
            <span className="truncate">Enviar Mensaje</span>
          </button>
        </div>
      </form>
    </section>
  );
};

export default ContactForm;