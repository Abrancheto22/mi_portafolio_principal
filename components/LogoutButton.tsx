"use client"; // <--- ¡Obligatorio! Es un componente interactivo.

import React from 'react';

const LogoutButton = () => {
  return (
    // Usamos un formulario para llamar a la ruta POST
    <form action="/auth/sign-out" method="post">
      <button 
        type="submit"
        className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-red-600 hover:bg-red-700 text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-4"
      >
        Logout
      </button>
    </form>
  );
};

export default LogoutButton;