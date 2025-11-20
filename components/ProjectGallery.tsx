"use client";

import React, { useState } from 'react';
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
  // 1. Unificamos todo en una sola lista
  const items = [
    ...(coverImage ? [{ id: 'cover', url: coverImage, tipo: 'imagen' }] : []),
    ...gallery
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  if (items.length === 0) {
    return (
      <div className="w-full h-96 bg-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-2">
        <FaImage size={48} />
        <span className="font-medium">Sin imágenes disponibles</span>
      </div>
    );
  }

  const currentItem = items[currentIndex];

  // Funciones de navegación
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
      
      {/* --- 1. VISOR PRINCIPAL (Main Stage) --- */}
      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl group border border-slate-800">
        
        {/* Contenido (Imagen o Video) */}
        {currentItem.tipo === 'video' ? (
          <video 
            src={currentItem.url} 
            controls 
            autoPlay 
            loop // Opcional: loop para videos cortos
            className="w-full h-full object-contain" 
          />
        ) : (
          <div
            className="w-full h-full transition-all duration-500 ease-in-out"
            style={{ 
              backgroundImage: `url(${currentItem.url})`,
              backgroundSize: 'contain', // Ajusta la imagen sin cortarla
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Fondo borroso detrás para llenar espacios vacíos (Efecto profesional) */}
            <div 
              className="absolute inset-0 -z-10 blur-2xl opacity-50 scale-110"
              style={{ 
                backgroundImage: `url(${currentItem.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </div>
        )}

        {/* Flechas de Navegación (Solo si hay más de 1) */}
        {items.length > 1 && (
          <>
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 transform group-hover:scale-100 scale-90"
            >
              <FaChevronLeft size={24} />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 transform group-hover:scale-100 scale-90"
            >
              <FaChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* --- 2. TIRA DE MINIATURAS (Thumbnails) --- */}
      {items.length > 1 && (
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 px-1">
          {items.map((item, index) => (
            <div
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative aspect-square cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200
                ${currentIndex === index 
                  ? 'border-blue-600 ring-2 ring-blue-100 opacity-100 scale-105' 
                  : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
                }`
              }
            >
              {item.tipo === 'video' ? (
                <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                  <video src={item.url} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                  <FaPlayCircle className="text-white/80 z-10" size={20} />
                </div>
              ) : (
                <img 
                  src={item.url} 
                  alt={`Miniatura ${index + 1}`} 
                  className="w-full h-full object-cover" 
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}