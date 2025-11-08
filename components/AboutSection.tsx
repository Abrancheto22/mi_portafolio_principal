import React from 'react';

interface AboutSectionProps {
  aboutText: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ aboutText }) => {
  return (
    <section id="about" className="scroll-mt-20 mb-8">
      <h2 className="text-slate-900 text-3xl font-bold px-4 pb-3 pt-5 border-b-2 border-blue-500 mb-4">Acerca de</h2>
      <p className="text-slate-700 text-base leading-relaxed pb-3 pt-1 px-4">
        {aboutText} {/* <-- DATO DINÁMICO */}
      </p>
    </section>
  );
};

export default AboutSection;