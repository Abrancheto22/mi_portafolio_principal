import React from 'react';

const EducationSection = () => {
  return (
    <section id="education" className="scroll-mt-20">
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Educación
      </h2>
      <div className="flex gap-4 bg-[#111a22] px-4 py-3">
        <div className="flex flex-1 flex-col justify-center">
          {/* !! IMPORTANTE: Añade tu educación real */}
          <p className="text-white text-base font-medium leading-normal">Universidad Nacional de Trujillo (UNITRU)</p>
          <p className="text-[#92adc9] text-sm font-normal leading-normal">2018 - 2024</p>
          <p className="text-[#92adc9] text-sm font-normal leading-normal">Ingeniería de Sistemas</p>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;