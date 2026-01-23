"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaInfoCircle, FaBookOpen } from 'react-icons/fa';

interface Props {
  title: string;
  description: string;
}

export default function ProjectDescription({ title, description }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  // Bloqueo de scroll mejorado
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Pequeño truco para evitar saltos de layout por el scrollbar
      document.body.style.paddingRight = 'var(--scrollbar-width, 0px)';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const limit = 200;
  const isLong = description.length > limit;
  const previewText = isLong ? `${description.substring(0, limit)}...` : description;

  return (
    <>
      {/* VISTA PREVIA (SIDEBAR) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full group hover:shadow-md transition-shadow">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <FaInfoCircle className="text-blue-500" /> Sobre el Proyecto
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap flex-grow">
          {previewText}
        </p>
        
        {isLong && (
          <button
            onClick={() => setIsOpen(true)}
            className="mt-4 flex items-center gap-2 text-blue-600 font-bold text-xs hover:text-blue-800 transition-all uppercase tracking-widest text-left"
          >
            <FaBookOpen size={14} /> Leer descripción completa
          </button>
        )}
      </div>

      {/* MODAL REDISEÑADO: ANCHO, BAJO Y POR ENCIMA DEL NAVBAR */}
      <AnimatePresence>
        {isOpen && (
          // z-[10000] asegura estar por encima del Navbar (z-40)
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-10">
            
            {/* Backdrop con opacidad mayor para ocultar el Navbar de fondo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />

            {/* Contenedor del Modal: Súper ancho (5xl) pero altura controlada (75vh) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="relative w-full max-w-5xl bg-white rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[75vh]"
            >
              {/* Header con estilo de "Dashboard" */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-white sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex w-10 h-10 bg-blue-600 rounded-xl items-center justify-center text-white shadow-lg shadow-blue-200">
                    <FaBookOpen size={18} />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none">{title}</h2>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mt-2">Detalles del desarrollo</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-3 rounded-xl bg-slate-100 hover:bg-red-500 hover:text-white text-slate-500 transition-all duration-300"
                  title="Cerrar ventana"
                >
                  <FaTimes size={18} />
                </button>
              </div>

              {/* Contenido: Líneas anchas y cómodas */}
              <div className="px-8 md:px-12 py-10 overflow-y-auto custom-scrollbar">
                <div className="max-w-4xl mx-auto">
                  <div className="prose prose-slate prose-base md:prose-lg max-w-none">
                    <p className="text-slate-600 leading-relaxed md:leading-loose whitespace-pre-wrap">
                      {description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer Compacto */}
              <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-8 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all active:scale-95 shadow-lg"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}