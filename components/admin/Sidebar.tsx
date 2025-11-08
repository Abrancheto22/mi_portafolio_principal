import Link from 'next/link';
import React from 'react';

// Define los enlaces de tu dashboard
const links = [
  { href: '/admin', label: 'Resumen' },
  { href: '/admin/proyectos', label: 'Proyectos' },
  { href: '/admin/experiencia', label: 'Experiencia' },
  { href: '/admin/educacion', label: 'Educación' },
  { href: '/admin/sobre-mi', label: 'Sobre Mí' },
  { href: '/', label: '← Volver al Portafolio' },
];

const Sidebar = () => {
  return (
    // --- CAMBIOS DE TEMA AQUÍ ---
    <aside className="w-64 bg-white p-6 border-r border-gray-200 min-h-screen">
      <h2 className="text-gray-900 text-xl font-bold mb-6">Admin Panel</h2>
      <nav>
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link 
                href={link.href} 
                className="flex px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors duration-200 font-medium"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;