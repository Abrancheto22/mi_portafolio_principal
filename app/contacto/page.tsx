import ContactForm from '@/components/ContactForm';
import { Metadata } from 'next';

// 1. Metadata (sin cambios)
export const metadata: Metadata = {
  title: 'Contacto | Abraham Ordoñez',
  description: 'Ponte en contacto con Abraham Ordoñez, Ingeniero de Sistemas.',
};

// 2. La nueva página de Contacto (con mejor diseño)
export default function ContactPage() {
  return (
    <div className="layout-container flex h-full grow flex-col">
      {/* Centramos el contenido */}
      <div className="px-4 md:px-20 lg:px-40 flex flex-1 justify-center items-center py-12">
        <div className="layout-content-container flex flex-col max-w-[960px] w-full">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Columna Izquierda: Título y Texto */}
            <div className="flex flex-col justify-center">
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight
                           text-transparent bg-clip-text 
                           bg-gradient-to-r from-blue-600 to-purple-600">
                Hablemos.
              </h1>
              <p className="text-slate-600 text-lg mt-6 leading-relaxed">
                ¿Tienes un proyecto en mente, una oportunidad laboral o simplemente quieres saludar?
                <br /><br />
                Estoy disponible para oportunidades freelance y colaboraciones.
                Usa el formulario para enviarme un mensaje y me pondré en contacto contigo lo antes posible.
              </p>
              
              <div className="mt-8">
                <span className="text-sm font-semibold text-gray-500 uppercase">O encuéntrame en:</span>
                {/* (Aquí podríamos cargar los iconos de redes sociales si quisiéramos) */}
                <p className="text-slate-700 font-semibold mt-2">abrahamordonezj18@gmail.com</p>
              </div>
            </div>

            {/* Columna Derecha: El Formulario (dentro de una "tarjeta") */}
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Envíame un mensaje
              </h2>
              <ContactForm />
            </div>

          </div>
          
        </div>
      </div>
    </div>
  );
}