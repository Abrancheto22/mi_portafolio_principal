import React from 'react';
import { PerfilItem } from '@/app/admin/sobre-mi/page'; // Importa el tipo

interface HeroProfileProps {
  profile: PerfilItem;
}

const HeroProfile: React.FC<HeroProfileProps> = ({ profile }) => {
  return (
    <div className="flex p-4 @container" id="profile">
      <div className="flex w-full flex-col gap-4 items-center py-16">
        <div className="flex gap-4 flex-col items-center">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32 border-4 border-white shadow-lg"
            style={{ backgroundImage: `url("${profile.url_foto_perfil || 'https://via.placeholder.com/150'}")` }}
          ></div>
          <div className="flex flex-col items-center justify-center mt-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-center
                         text-transparent bg-clip-text 
                         bg-gradient-to-r from-blue-600 to-purple-600">
              {profile.nombre_completo}
            </h1>
            <p className="text-slate-600 text-lg font-normal leading-normal text-center mt-2">
              {profile.titulo}
            </p>
            <p className="text-slate-500 text-base font-normal leading-normal text-center">
              {profile.ubicacion}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroProfile;