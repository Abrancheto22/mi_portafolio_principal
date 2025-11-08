import SkillForm from '@/components/admin/SkillForm';
import Link from 'next/link';

export default function CreateSkillPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-gray-900 text-3xl font-bold">
          Añadir Nueva Habilidad
        </h1>
        <Link
          href="/admin/habilidades"
          className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-gray-600 hover:bg-gray-700 text-white text-sm font-bold"
        >
          Cancelar
        </Link>
      </div>
      
      <SkillForm />
      
    </div>
  );
}