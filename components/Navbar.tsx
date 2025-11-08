"use client";

import React from 'react';
import LogoutButton from './LogoutButton';
import { type User } from '@supabase/supabase-js';
import type { SocialLinkItem } from '@/app/admin/redes/page';

// --- 1. IMPORTA LOS ICONOS DESDE LA BIBLIOTECA ---
import { FaGithub, FaLinkedin, FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
// (Si necesitas más, solo añádelos aquí, ej: FaTwitter, FaInstagram)

// --- 2. MAPA DE ICONOS (AHORA SÚPER LIMPIO) ---
// Mapea el 'nombre' (en minúsculas) de tu DB al componente de icono
const iconMap: { [key: string]: React.ReactNode } = {
  github: <FaGithub size={20} />,    // Tamaño 20
  linkedin: <FaLinkedin size={20} />, // Tamaño 20
  facebook: <FaFacebook size={20} />, // Tamaño 20
  twitter: <FaTwitter size={20} />, // Tamaño 20
  instagram: <FaInstagram size={20} />, // Tamaño 20
  youtube: <FaYoutube size={20} />, // Tamaño 20
};
// --- FIN DEL MAPA DE ICONOS ---


interface NavbarProps {
  user: User | null;
  socialLinks: SocialLinkItem[]; 
}

const Navbar: React.FC<NavbarProps> = ({ user, socialLinks }) => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 bg-white/75 px-10 py-3 backdrop-blur-lg">
      
      <div className="flex items-center gap-4 text-slate-900">
        <div className="size-4">
          {/* (Tu LogoIcon aquí, si lo tienes como componente separado) */}
        </div>
        <h2 className="text-slate-900 text-lg font-bold ...">
          Tech Portfolio
        </h2>
      </div>
      
      <div className="flex flex-1 justify-end gap-8">
        {/* ... (Enlaces de navegación - sin cambios) ... */}
        <div className="flex items-center gap-9">
          <a className="text-slate-600 ..." href="#about">Acerca de</a>
          <a className="text-slate-600 ..." href="#experience">Experiencia</a>
          <a className="text-slate-600 ..." href="#projects">Proyectos</a>
          <a className="text-slate-600 ..." href="#contact">Contacto</a>
          {user && (<span className="text-blue-600 ...">(ADMIN)</span>)}
        </div>
        
        <div className="flex gap-2">
          
          {/* 3. LÓGICA DE MAPEO (¡ESTA PARTE ES IDÉNTICA!) */}
          {/* Funciona igual porque solo cambiamos el 'iconMap' */}
          {socialLinks && socialLinks.map((link) => {
            // Convierte "GitHub", "Facebook" a "github", "facebook"
            const key = link.nombre.toLowerCase(); 
            const IconComponent = iconMap[key]; // Busca en el mapa

            if (!IconComponent) {
              return null;
            }

            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.nombre}
                className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                {IconComponent}
              </a>
            );
          })}
          
          {user && (
            <LogoutButton />
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;