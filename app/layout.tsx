import type { Metadata } from "next";
import { Inter, Noto_Sans } from "next/font/google";
import "./globals.css";

// --- AÑADIMOS LÓGICA DE DATOS ---
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import Navbar from '@/components/Navbar';
import type { SocialLinkItem } from '@/app/admin/redes/page';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans",
});

export const metadata = {
  title: "Abraham Ordoñez | Portafolio de Ingeniería",
  description: "Portafolio de Abraham Ordoñez, Ingeniero de Sistemas.",
};

// --- AÑADIMOS ESTA FUNCIÓN ---
async function getSocialLinks(supabase: any): Promise<SocialLinkItem[]> {
  const { data, error } = await supabase
    .from('redes_sociales')
    .select('*')
    .eq('estado', true)
    .order('nombre', { ascending: true });
    
  if (error) console.error("Error al cargar redes sociales:", error.message);
  return data || [];
}

// --- EL LAYOUT AHORA ES 'async' ---
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // --- OBTENEMOS LOS DATOS PARA EL NAVBAR ---
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  const [
    { data: { user } },
    socialLinks
  ] = await Promise.all([
    supabase.auth.getUser(),
    getSocialLinks(supabase)
  ]);

  return (
    <html lang="es">
      <body
        className={`font-inter antialiased ${inter.variable} ${notoSans.variable} bg-slate-50 text-slate-900`}
      >
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root">
          
          {/* --- RENDERIZAMOS EL NAVBAR AQUÍ --- */}
          <Navbar user={user} socialLinks={socialLinks} />
          
          {/* 'children' será la página que corresponda (Inicio, Proyectos, etc.) */}
          {children}
        
        </div>
      </body>
    </html>
  );
}