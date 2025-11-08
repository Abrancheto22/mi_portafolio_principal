import EducationForm from '@/components/admin/EducationForm';
import Link from 'next/link';

export default function CreateEducationPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-gray-900 text-3xl font-bold">
          Añadir Registro de Educación
        </h1>
        <Link
          href="/admin/educacion"
          className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-gray-600 hover:bg-gray-700 text-white text-sm font-bold"
        >
          Cancelar
        </Link>
      </div>
      
      <EducationForm />
      
    </div>
  );
}