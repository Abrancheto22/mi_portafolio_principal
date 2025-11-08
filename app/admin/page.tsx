export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-gray-900 text-3xl font-bold mb-6">
        Resumen del Administrador
      </h1>
      <p className="text-gray-700 mb-4">
        Bienvenido al panel de control. Selecciona una sección del menú
        de la izquierda para comenzar a editar el contenido de tu portafolio.
      </p>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-gray-900 text-xl font-semibold mb-4">
          Estado del Sitio
        </h2>
        <p className="text-gray-600">
          Todo funciona correctamente.
        </p>
      </div>
    </div>
  );
}