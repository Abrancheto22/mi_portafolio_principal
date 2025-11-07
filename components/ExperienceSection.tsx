import React from 'react';

const ExperienceSection = () => {
  return (
    <section id="experience" className="scroll-mt-20">
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Experiencia
      </h2>
      <div className="flex gap-4 bg-[#111a22] px-4 py-3">
        <div className="flex flex-1 flex-col justify-center">
          {/* !! IMPORTANTE: Añade tu experiencia real */}
          <p className="text-white text-base font-medium leading-normal">Ingeniero de Software en InnovaTech Solutions</p>
          <p className="text-[#92adc9] text-sm font-normal leading-normal">2020 - 2024</p>
          <p className="text-[#92adc9] text-sm font-normal leading-normal">
            Desarrollé y mantuve aplicaciones web utilizando React y Node.js. Implementé nuevas funcionalidades y mejoré el rendimiento de las aplicaciones existentes.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;