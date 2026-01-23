import React from 'react';

interface AboutSectionProps {
  aboutText: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ aboutText }) => {
  return (
    // Ya no es una tarjeta, vuelve a ser una sección simple
    <section id="about" className="scroll-mt-20 my-16 px-4">
      <h2 className="text-slate-900 text-3xl font-bold mb-6 border-b-2 border-blue-500 pb-3">
        Acerca de Mí
      </h2>
      
      <div className="prose prose-slate max-w-none text-slate-700 text-lg leading-relaxed text-justify">
        <p>
          {aboutText}
        </p>
      </div>
    </section>
  );
};

export default AboutSection;