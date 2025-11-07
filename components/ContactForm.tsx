"use client";
import React from 'react';

const ContactForm = () => {
  return (
    <section id="contact" className="scroll-mt-20">
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Contacto
      </h2>

      {/* (Este es un formulario estático por ahora, no enviará nada) 
        En un futuro, podemos conectarlo a un servicio de email.
      */}
      <form>
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-white text-base font-medium leading-normal pb-2">Correo Electrónico</p>
            <input
              type="email"
              name="email"
              placeholder="tu_correo@ejemplo.com"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#324d67] bg-[#192633] focus:border-[#324d67] h-14 placeholder:text-[#92adc9] p-[15px] text-base font-normal leading-normal"
            />
          </label>
        </div>
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-white text-base font-medium leading-normal pb-2">Mensaje</p>
            <textarea
              name="message"
              placeholder="Escribe tu mensaje aquí"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#324d67] bg-[#192633] focus:border-[#324d67] min-h-36 placeholder:text-[#92adc9] p-[15px] text-base font-normal leading-normal"
            ></textarea>
          </label>
        </div>
        <div className="flex px-4 py-3">
          <button 
            type="submit" 
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#1380ec] text-white text-sm font-bold leading-normal tracking-[-0.015em]"
            // Deshabilitamos el envío por ahora
            onClick={(e) => e.preventDefault()}
          >
            <span className="truncate">Enviar</span>
          </button>
        </div>
      </form>
    </section>
  );
};

export default ContactForm;