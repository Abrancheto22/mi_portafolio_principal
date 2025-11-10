"use client"; // Es 'client' solo por el LogoutButton

import React from 'react';
import LogoutButton from './LogoutButton';
import { type User } from '@supabase/supabase-js';
import type { SocialLinkItem } from '@/app/admin/redes/page';

// Importa los iconos de la biblioteca
import { FaGithub, FaLinkedin, FaFacebook } from 'react-icons/fa';

// --- MAPA DE ICONOS ---
const iconMap: { [key: string]: React.ReactNode } = {
  github: <FaGithub size={20} />,
  linkedin: <FaLinkedin size={20} />,
  facebook: <FaFacebook size={20} />,
};
// --- FIN DEL MAPA ---

interface NavbarProps {
  user: User | null;
  socialLinks: SocialLinkItem[]; 
}

// --- ESTE ES EL NAVBAR NO-RESPONSIVE (PERO STICKY) ---
const Navbar: React.FC<NavbarProps> = ({ user, socialLinks }) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 bg-white/75 px-10 py-3 backdrop-blur-lg">
      
      {/* Logo y Título */}
      <div className="flex items-center gap-4 text-slate-900">
        <div className="size-4">{/* <LogoIcon /> */}</div>
        <h2 className="text-slate-900 text-lg font-bold">
          Tech Portfolio
        </h2>
      </div>
      
      {/* Enlaces de Escritorio (Siempre visibles) */}
      <div className="flex flex-1 justify-end gap-8">
        <div className="flex items-center gap-9">
          <a className="text-slate-600 hover:text-slate-900 text-sm font-medium" href="/">Inicio</a>
          <a className="text-slate-600 hover:text-slate-900 text-sm font-medium" href="/proyectos">Proyectos</a>
          <a className="text-slate-600 hover:text-slate-900 text-sm font-medium" href="/contacto">Contacto</a>
          {user && (<span className="text-blue-600 text-sm font-bold">(ADMIN)</span>)}
        </div>
        
        {/* Iconos (Siempre visibles) */}
        <div className="flex gap-2">
          {socialLinks && socialLinks.map((link) => {
            const IconComponent = iconMap[link.nombre.toLowerCase()];
            if (!IconComponent) return null;
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