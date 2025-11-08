"use client";
import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin', label: 'Resumen' },
  { href: '/admin/proyectos', label: 'Proyectos' },
  { href: '/admin/experiencia', label: 'Experiencia' },
  { href: '/admin/educacion', label: 'Educación' },
    { href: '/admin/habilidades', label: 'Habilidades' },
  { href: '/admin/sobre-mi', label: 'Sobre Mí' },
  { href: '/', label: '← Volver al Portafolio' },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white p-6 border-r border-gray-200 min-h-screen">
      <h2 className="text-gray-900 text-xl font-bold mb-6">Admin Panel</h2>
      <nav>
        <ul className="space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <li key={link.href}>
                <Link 
                  href={link.href}
                  className={`flex px-4 py-2 rounded-md transition-all duration-300 font-medium
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold shadow-md' 
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;