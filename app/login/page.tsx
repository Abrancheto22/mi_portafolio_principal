"use client"; // <--- Obligatorio para la interactividad

import { createClient } from '@/lib/supabase/client'; // Importamos el cliente del NAVEGADOR
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const supabase = createClient(); // Cliente del lado del cliente (navegador)
  const router = useRouter();

  // Redirigir si el usuario ya está logueado
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/'); // Si ya hay sesión, llévame al inicio
      }
    };
    checkSession();
  }, [supabase, router]);

  // Cuando el login es exitoso...
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_IN') {
      router.push('/'); // Redirige al portafolio principal
      router.refresh(); // Refresca la página para cargar la sesión del servidor
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111a22] p-4">
      <div className="w-full max-w-md rounded-lg bg-[#192633] p-8 shadow-lg border border-[#324d67]">
        <h1 className="mb-6 text-center text-3xl font-bold text-white">
          Acceso de Administrador
        </h1>
        {/* Este es el componente de UI de Supabase */}
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          providers={['github']} // Opcional: puedes añadir login con GitHub
          localization={{
            variables: {
              sign_in: {
                email_label: 'Correo Electrónico',
                password_label: 'Contraseña',
                button_label: 'Iniciar Sesión',
                social_provider_text: 'Iniciar con {{provider}}',
              },
              sign_up: {
                email_label: 'Correo Electrónmico',
                password_label: 'Contraseña',
                button_label: 'Registrarse',
              }
            },
          }}
        />
      </div>
    </div>
  );
}