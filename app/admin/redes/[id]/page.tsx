import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SocialLinkForm from '@/components/admin/SocialLinkForm';
import Link from 'next/link';
import { SocialLinkItem } from '../page';

interface EditSocialLinkPageProps { params: { id: string; }; }

async function getSocialLink(id: string): Promise<SocialLinkItem | null> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase
    .from('redes_sociales')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error("Error al cargar red:", error?.message);
    return null;
  }
  return data as SocialLinkItem;
}

export default async function EditSocialLinkPage({ params }: EditSocialLinkPageProps) {
  const { id } = params;
  const socialLink = await getSocialLink(id);

  if (!socialLink) {
    redirect('/admin/redes');
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-gray-900 text-3xl font-bold">Editar Red Social</h1>
        <Link href="/admin/redes" className="flex min-w-[100px] ...">
          Cancelar
        </Link>
      </div>
      <SocialLinkForm socialLink={socialLink} />
    </div>
  );
}