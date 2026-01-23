import type { Metadata } from "next";
import { Inter, Noto_Sans } from "next/font/google";
import "./globals.css";
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import Navbar from '@/components/Navbar';
import type { SocialLinkItem } from '@/app/admin/redes/page';
import { Analytics } from "@vercel/analytics/react";
import { SupabaseClient } from '@supabase/supabase-js';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans",
});

export const metadata = {
  title: "Abraham Ordoñez | Portafolio de Ingeniería",
  description: "Portafolio de Abraham Ordoñez, Ingeniero de Sistemas.",
};

async function getSocialLinks(supabase: SupabaseClient): Promise<SocialLinkItem[]> {
  const { data, error } = await supabase
    .from('redes_sociales')
    .select('*')
    .eq('estado', true)
    .order('nombre', { ascending: true });
    
  if (error) console.error("Error al cargar redes sociales:", error.message);
  return (data as SocialLinkItem[]) || [];
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
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
        className={`font-inter antialiased ${inter.variable} ${notoSans.variable} 
                   bg-slate-50 text-slate-900 
                   flex flex-col min-h-screen`}
      >
        <Navbar user={user} socialLinks={socialLinks} />
        
        <main className="flex-grow">
          {children}
        </main>

        <Analytics />
        
      </body>
    </html>
  );
}