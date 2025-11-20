"use client";

import React, { useState, useEffect } from 'react';
import LogoutButton from './LogoutButton';
import { type User } from '@supabase/supabase-js';
import type { SocialLinkItem } from '@/app/admin/redes/page';

// Importamos iconos de React Icons
import { FaGithub, FaLinkedin, FaFacebook } from 'react-icons/fa';
import { HiMenu, HiX } from 'react-icons/hi'; // Iconos para el menú móvil

// --- MAPA DE ICONOS ---
const iconMap: { [key: string]: React.ReactNode } = {
  github: <FaGithub size={20} />,
  linkedin: <FaLinkedin size={20} />,
  facebook: <FaFacebook size={20} />,
};

interface NavbarProps {
  user: User | null;
  socialLinks: SocialLinkItem[];
}

const Navbar: React.FC<NavbarProps> = ({ user, socialLinks }) => {
  // Estado para abrir/cerrar el menú
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Función para cerrar el menú al hacer clic en un enlace
  const closeMenu = () => setIsMobileMenuOpen(false);

  // Bloquear el scroll del body cuando el menú está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* --- BARRA DE NAVEGACIÓN PRINCIPAL --- */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo / Título */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600"></div>
            <span className="text-lg font-bold text-slate-900">Tech Portfolio</span>
          </div>

          {/* --- MENÚ DE ESCRITORIO (Hidden en Mobile) --- */}
          <div className="hidden md:flex md:items-center md:gap-8">
            <nav className="flex gap-6">
              <a href="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Inicio</a>
              <a href="/proyectos" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Proyectos</a>
              <a href="/contacto" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Contacto</a>
              {user && <span className="text-sm font-bold text-blue-600">(ADMIN)</span>}
            </nav>

            {/* Iconos Sociales Desktop */}
            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
              {socialLinks && socialLinks.map((link) => {
                const IconComponent = iconMap[link.nombre.toLowerCase()];
                if (!IconComponent) return null;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {IconComponent}
                  </a>
                );
              })}
              {user && <LogoutButton />}
            </div>
          </div>

          {/* --- BOTÓN HAMBURGUESA (Visible solo en Mobile) --- */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Abrir menú principal"
            >
              <HiMenu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* --- MENÚ MÓVIL (OVERLAY + DRAWER) --- */}
      {/* Este bloque está fuera del header visualmente gracias a 'fixed inset-0' */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden">
          
          {/* 1. Fondo Oscuro (Al hacer clic, cierra el menú) */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
            onClick={closeMenu}
          />

          {/* 2. Panel Lateral (Drawer) */}
          <div className="relative w-full max-w-xs bg-white p-6 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
            
            {/* Cabecera del Menú Móvil */}
            <div className="flex items-center justify-between mb-8">
              <span className="text-lg font-bold text-slate-900">Menú</span>
              <button
                type="button"
                onClick={closeMenu}
                className="-m-2.5 rounded-md p-2.5 text-slate-700 hover:bg-slate-100"
              >
                <span className="sr-only">Cerrar menú</span>
                <HiX className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* Enlaces de Navegación Móvil */}
            <div className="flex flex-col gap-6 text-lg font-medium text-slate-900">
              <a href="/" onClick={closeMenu} className="hover:text-blue-600">Inicio</a>
              <a href="/proyectos" onClick={closeMenu} className="hover:text-blue-600">Proyectos</a>
              <a href="/contacto" onClick={closeMenu} className="hover:text-blue-600">Contacto</a>
              {user && <span className="text-blue-600 text-sm">(Modo Admin Activo)</span>}
            </div>

            {/* Footer del Menú Móvil (Redes + Logout) */}
            <div className="mt-auto border-t border-slate-100 pt-6">
              <p className="mb-4 text-sm text-slate-500">Sígueme en:</p>
              <div className="flex gap-6 mb-6">
                {socialLinks && socialLinks.map((link) => {
                  const IconComponent = iconMap[link.nombre.toLowerCase()];
                  if (!IconComponent) return null;
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      {/* Clonamos el icono para hacerlo más grande en móvil */}
                      {React.cloneElement(IconComponent as React.ReactElement, { size: 24 })}
                    </a>
                  );
                })}
              </div>
              
              {user && (
                <div className="w-full">
                  <LogoutButton />
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;