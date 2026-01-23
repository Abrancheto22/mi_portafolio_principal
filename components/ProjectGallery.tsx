"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight, FaPlayCircle, FaImage } from 'react-icons/fa';

type GalleryItem = {
  id: string;
  url: string;
  tipo: string;
};

interface ProjectGalleryProps {
  coverImage: string | null;
  gallery: GalleryItem[];
}

export default function ProjectGallery({ coverImage, gallery }: ProjectGalleryProps) {
  const items = [
    ...(coverImage ? [{ id: 'cover', url: coverImage, tipo: 'imagen' }] : []),
    ...gallery
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  if (items.length === 0) {
    return (
      // Cambié el fondo a un tono más oscuro para que coincida con el nuevo diseño
      <div className="w-full aspect-video bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-slate-500 gap-3 border border-slate-800">
        <FaImage size={48} />
        <span className="font-medium text-sm uppercase tracking-wider">Sin multimedia</span>
      </div>
    );
  }

  const currentItem = items[currentIndex];

  const prevSlide = () => {
    const newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };
  const nextSlide = () => {
    const newIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="flex flex-col gap-4">
      
      {/* --- 1. VISOR PRINCIPAL --- */}
      {/* Usamos bg-slate-900 en lugar de black puro para que sea menos duro */}
      <div className="relative w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-2xl group border border-slate-800/50">
        
        {currentItem.tipo === 'video' ? (
          <video 
            src={currentItem.url} 
            controls 
            // autoPlay // Opcional: a veces es molesto que arranque solo con sonido
            className="w-full h-full object-cover" // <--- CAMBIO CLAVE: object-cover
          />
        ) : (
          // Imagen Principal
          <Image 
            src={currentItem.url}
            alt={`Imagen del proyecto ${currentIndex + 1}`}
            fill
            // <--- CAMBIO CLAVE: object-cover. Quitamos el z-10 y el blur de fondo anterior.
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority 
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        )}

        {/* Flechas de Navegación (con un diseño un poco más limpio) */}
        {items.length > 1 && (
          <>
            <button 
              onClick={prevSlide}
              aria-label="Imagen anterior"
              // Botones más sutiles que aparecen al pasar el mouse
              className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/20 hover:bg-black/50 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110 border border-white/10"
            >
              <FaChevronLeft size={20} />
            </button>
            <button 
              onClick={nextSlide}
              aria-label="Siguiente imagen"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/20 hover:bg-black/50 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110 border border-white/10"
            >
              <FaChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* --- 2. TIRA DE MINIATURAS (Thumbnails) --- */}
      {items.length > 1 && (
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-3 px-2">
          {items.map((item, index) => (
            <div
              key={index}
              onClick={() => setCurrentIndex(index)}
              // Miniaturas con bordes más redondeados y mejor feedback visual
              className={`relative aspect-square cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 ease-out
                ${currentIndex === index 
                  ? 'border-blue-500 ring-4 ring-blue-500/20 opacity-100 scale-100 z-10 shadow-lg' 
                  : 'border-transparent opacity-50 hover:opacity-100 hover:scale-105 hover:border-slate-300'
                }`
              }
            >
              {item.tipo === 'video' ? (
                <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                  <video src={item.url} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                  <FaPlayCircle className="text-white z-10 drop-shadow-lg" size={24} />
                </div>
              ) : (
                <Image 
                  src={item.url} 
                  alt={`Miniatura ${index + 1}`} 
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 20vw, 150px"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}