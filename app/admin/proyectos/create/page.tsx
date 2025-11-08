import ProjectForm from '@/components/admin/ProjectForm';
import Link from 'next/link';

// Esta página envuelve el formulario de creación
export default function CreateProjectPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-gray-900 text-3xl font-bold">
          Crear Nuevo Proyecto
        </h1>
        <Link
          href="/admin/proyectos"
          className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-gray-600 hover:bg-gray-700 text-white text-sm font-bold"
        >
          Cancelar
        </Link>
      </div>
      
      {/* El formulario reutilizable */}
      <ProjectForm />
      
    </div>
  );
}