"use client";

import React, { useState, useRef } from 'react';
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
  const thumbnailsRef = useRef<HTMLDivElement>(null); 

  if (items.length === 0) {
    return (
      <div className="w-full h-96 bg-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-2">
        <FaImage size={48} />
        <span className="font-medium">Sin imágenes disponibles</span>
      </div>
    );
  }

  const currentItem = items[currentIndex];

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
    if (thumbnailsRef.current) {
      const thumbnail = thumbnailsRef.current.children[index] as HTMLElement;
      if (thumbnail) {
        const scrollLeft = thumbnail.offsetLeft - (thumbnailsRef.current.offsetWidth / 2) + (thumbnail.offsetWidth / 2);
        thumbnailsRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  };

  const prevSlide = () => {
    const newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    handleThumbnailClick(newIndex);
  };
  const nextSlide = () => {
    const newIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
    handleThumbnailClick(newIndex);
  };

  return (
    <div className="flex flex-col gap-4">
      
      {/* --- 1. VISOR PRINCIPAL --- */}
      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl group border border-slate-800">
        
        {currentItem.tipo === 'video' ? (
          <video 
            src={currentItem.url} 
            controls 
            autoPlay 
            loop
            className="w-full h-full object-contain" 
          />
        ) : (
          <div className="w-full h-full relative">
             <div 
              className="absolute inset-0 -z-10 blur-2xl opacity-40 scale-110 transition-all duration-500"
              style={{ 
                backgroundImage: `url(${currentItem.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div
              className="w-full h-full transition-all duration-500 ease-in-out"
              style={{ 
                backgroundImage: `url(${currentItem.url})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
          </div>
        )}

        {/* --- FLECHAS DE NAVEGACIÓN (CORREGIDAS) --- */}
        {items.length > 1 && (
          <>
            <button 
              onClick={prevSlide}
              // CAMBIO: bg-black/50 hace que el círculo sea oscuro y visible siempre
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full 
                         bg-black/50 hover:bg-black/70 text-white 
                         backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 
                         transform group-hover:scale-100 scale-90 border border-white/10 shadow-lg"
              title="Anterior"
            >
              <FaChevronLeft size={20} />
            </button>
            <button 
              onClick={nextSlide}
              // CAMBIO: Igual aquí, fondo oscuro para contraste
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full 
                         bg-black/50 hover:bg-black/70 text-white 
                         backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 
                         transform group-hover:scale-100 scale-90 border border-white/10 shadow-lg"
              title="Siguiente"
            >
              <FaChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* --- 2. TIRA DE MINIATURAS --- */}
      {items.length > 1 && (
        <div 
          ref={thumbnailsRef}
          className="flex gap-2 px-1 overflow-x-auto pb-2 scrollbar-hide scroll-smooth"
        >
          {items.map((item, index) => (
            <div
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 ease-out
                ${currentIndex === index 
                  ? 'border-blue-600 ring-2 ring-blue-100 opacity-100 scale-100' 
                  : 'border-transparent opacity-50 hover:opacity-100 hover:scale-105'
                }`
              }
            >
              {item.tipo === 'video' ? (
                <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                  <video src={item.url} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                  <FaPlayCircle className="text-white/90 z-10 drop-shadow-lg" size={24} />
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