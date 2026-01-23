"use client";

import React, { useState } from 'react';
import Image from 'next/image'; // <--- 1. Importamos el componente Image
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
      <div className="w-full h-96 bg-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-2">
        <FaImage size={48} />
        <span className="font-medium">Sin imágenes disponibles</span>
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
          // Usamos un contenedor relativo para que 'fill' funcione
          <div className="relative w-full h-full">
            
            {/* Fondo borroso (Efecto ambiental) */}
            <Image 
              src={currentItem.url}
              alt="Fondo ambiental"
              fill
              className="object-cover blur-2xl opacity-50 scale-110 -z-10"
            />

            {/* Imagen Principal Nítida */}
            <Image 
              src={currentItem.url}
              alt={`Imagen del proyecto ${currentIndex + 1}`}
              fill
              className="object-contain z-10"
              priority // Carga esta imagen de inmediato (sin lazy load) porque es la principal
              sizes="(max-width: 768px) 100vw, 1200px" // Ayuda al navegador a elegir el tamaño correcto
            />
          </div>
        )}

        {/* Flechas de Navegación */}
        {items.length > 1 && (
          <>
            <button 
              onClick={prevSlide}
              aria-label="Imagen anterior"
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 transform group-hover:scale-100 scale-90 z-20"
            >
              <FaChevronLeft size={24} />
            </button>
            <button 
              onClick={nextSlide}
              aria-label="Siguiente imagen"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 transform group-hover:scale-100 scale-90 z-20"
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
                   {/* Para miniaturas de video no usamos Next Image porque es un video, 
                       pero podríamos poner una imagen poster si la tuvieras. 
                       Por ahora mantenemos el video original. */}
                  <video src={item.url} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                  <FaPlayCircle className="text-white/80 z-10" size={20} />
                </div>
              ) : (
                <Image 
                  src={item.url} 
                  alt={`Miniatura ${index + 1}`} 
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 20vw, 150px" // Las miniaturas son pequeñas
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}