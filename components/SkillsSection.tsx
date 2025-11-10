"use client";

import React from 'react';
import { HabilidadItem } from '@/app/admin/habilidades/page'; 
import Marquee from "react-fast-marquee"; // <-- 1. IMPORTA LA LIBRERÍA
import { 
  FaReact, FaNodeJs, FaPython, FaHtml5, FaCss3Alt, FaGitAlt, FaDocker, FaDatabase, FaLaravel 
} from 'react-icons/fa';
import { SiJavascript, SiTypescript, SiSupabase, SiPostgresql, SiNextdotjs } from 'react-icons/si';

// --- MAPA DE ICONOS (Sin cambios) ---
const skillIconMap: { [key: string]: React.ReactNode } = {
  'react': <FaReact size={40} className="text-blue-500" />,
  'next.js': <SiNextdotjs size={40} className="text-black" />,
  'javascript': <SiJavascript size={40} className="text-yellow-400" />,
  'typescript': <SiTypescript size={40} className="text-blue-600" />,
  'node.js': <FaNodeJs size={40} className="text-green-500" />,
  'python': <FaPython size={40} className="text-blue-400" />,
  'supabase': <SiSupabase size={40} className="text-green-600" />,
  'postgresql': <SiPostgresql size={40} className="text-blue-700" />,
  'sql': <FaDatabase size={40} className="text-gray-500" />,
  'html': <FaHtml5 size={40} className="text-orange-600" />,
  'css': <FaCss3Alt size={40} className="text-blue-500" />,
  'git': <FaGitAlt size={40} className="text-orange-700" />,
  'docker': <FaDocker size={40} className="text-blue-600" />,
  'laravel': <FaLaravel size={40} className="text-red-500" />,
  'mysql': <SiPostgresql size={40} className="text-blue-700" /> 
};
// --- FIN DEL MAPA ---

interface SkillsSectionProps {
  skills: HabilidadItem[];
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  
  const mappedSkills = skills.map(skill => {
    const key = skill.nombre.toLowerCase();
    return {
      id: skill.id,
      name: skill.nombre,
      icon: skillIconMap[key] || null
    };
  }).filter(skill => skill.icon); 

  if (mappedSkills.length === 0) {
    return null;
  }

  return (
    <section id="skills" className="scroll-mt-20 my-16">
      <h2 className="text-slate-900 text-3xl font-bold mb-10 text-center">
        Tecnologías que Manejo
      </h2>
      
      <div 
        className="w-full overflow-hidden 
                   [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]"
      >
        <Marquee
          gradient={false}
          speed={40}         
          pauseOnHover={true} 
          autoFill={true}      
        >
          {mappedSkills.map((skill) => (
            <div 
              key={skill.id} 
              className="flex flex-col items-center gap-2 w-24 mx-8"
            >
              <span className="text-6xl text-gray-700">
                {skill.icon}
              </span>
              <span className="text-sm font-semibold text-gray-600">
                {skill.name}
              </span>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default SkillsSection;