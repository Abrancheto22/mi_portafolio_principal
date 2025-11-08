import SocialLinkForm from '@/components/admin/SocialLinkForm';
import Link from 'next/link';

export default function CreateSocialLinkPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-gray-900 text-3xl font-bold">Añadir Red Social</h1>
        <Link href="/admin/redes" className="flex min-w-[100px] ...">
          Cancelar
        </Link>
      </div>
      <SocialLinkForm />
    </div>
  );
}