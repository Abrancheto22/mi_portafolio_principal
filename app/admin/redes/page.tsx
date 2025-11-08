import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import SocialLinksTable from '@/components/admin/SocialLinksTable';

export type SocialLinkItem = {
  id: string;
  nombre: string;
  url: string;
  created_at: string;
  estado: boolean;
};

async function getSocialLinks(): Promise<SocialLinkItem[]> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase
    .from('redes_sociales')
    .select('*')
    .order('nombre', { ascending: true });

  if (error) {
    console.error("Error al cargar redes:", error);
    return [];
  }
  return data as SocialLinkItem[];
}

export default async function AdminRedesPage() {
  const socialLinks = await getSocialLinks();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-gray-900 text-3xl font-bold">
          Gestión de Redes Sociales
        </h1>
        <Link
          href="/admin/redes/create"
          className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 
                     bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold
                     shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
        >
          Añadir Red Social
        </Link>
      </div>
      <SocialLinksTable socialLinks={socialLinks} />
    </div>
  );
}