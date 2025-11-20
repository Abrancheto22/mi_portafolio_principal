"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { upsertProject, deleteGalleryItem } from '@/lib/actions';
import React, { useState, useEffect } from 'react';
import type { PortafolioItem } from '@/app/admin/proyectos/page';
import { useRouter } from 'next/navigation';
import { FaTrash, FaPlayCircle, FaImage, FaCloudUploadAlt } from 'react-icons/fa';

// Definición del tipo local para evitar problemas de importación
type GalleryItem = {
  id: string;
  url: string;
  tipo: string;
};

interface ProjectFormProps {
  project?: PortafolioItem;
  gallery?: GalleryItem[];
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus(); 
  return (
    <button
      type="submit"
      disabled={pending}
      className={`flex-1 flex items-center justify-center rounded-lg h-10 px-6 
                 text-white text-sm font-bold shadow-sm transition-all duration-200
                 ${pending 
                   ? 'bg-gray-400 cursor-not-allowed' 
                   : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-md hover:scale-[1.02]'
                 }`}
    >
      {pending ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Guardar Proyecto')}
    </button>
  );
}

export default function ProjectForm({ project, gallery = [] }: ProjectFormProps) {
  const router = useRouter();
  const isEditing = !!project; 
  const initialState = { success: false, message: null }; 
  const [state, dispatch] = useFormState(upsertProject as any, initialState); 

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(project?.image_url || null);
  const [currentGallery, setCurrentGallery] = useState<GalleryItem[]>(gallery);
  const [pendingFiles, setPendingFiles] = useState<string[]>([]);
  const techsString = project?.tecnologias.join(', ') || '';

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        router.push('/admin/proyectos');
      }, 1500); 
      return () => clearTimeout(timer);
    }
  }, [state.success, router]);
  
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setImagePreviewUrl(project?.image_url || null);
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPreviews = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setPendingFiles(newPreviews);
    } else {
      setPendingFiles([]);
    }
  };

  const handleDeleteGalleryItem = async (id: string, url: string) => {
    if(!confirm("¿Eliminar archivo?")) return;
    setCurrentGallery(prev => prev.filter(item => item.id !== id));
    const res = await deleteGalleryItem(id, url);
    if (!res.success) alert("Error: " + res.message);
    else router.refresh();
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-5xl mx-auto">
      <form action={dispatch} className="space-y-5">
        
        {isEditing && <input type="hidden" name="id" defaultValue={project.id} />}
        <input type="hidden" name="image_url_existente" defaultValue={project?.image_url || ''} />

        {/* --- FILA 1: Título y Tecnologías --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="titulo" className="block text-xs font-bold text-gray-600 uppercase mb-1">Título</label>
            <input type="text" name="titulo" id="titulo" required 
              className="form-input w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm py-2" 
              placeholder="Nombre del Proyecto" defaultValue={project?.titulo} />
          </div>
          <div>
            <label htmlFor="tecnologias" className="block text-xs font-bold text-gray-600 uppercase mb-1">Tecnologías (CSV)</label>
            <input type="text" name="tecnologias" id="tecnologias" required 
              className="form-input w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm py-2" 
              placeholder="React, Next.js, Supabase" defaultValue={techsString} />
          </div>
        </div>

        {/* --- FILA 2: Descripción --- */}
        <div>
          <label htmlFor="descripcion" className="block text-xs font-bold text-gray-600 uppercase mb-1">Descripción</label>
          <textarea name="descripcion" id="descripcion" rows={2} required 
            className="form-textarea w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm py-2 resize-none" 
            placeholder="Breve descripción..." defaultValue={project?.descripcion} />
        </div>

        {/* --- SECCIÓN MULTIMEDIA (Dividida en 2 columnas) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          
          {/* Columna Izquierda: Portada */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Portada</label>
            <div className="flex items-center gap-4">
              <label htmlFor="file_proyecto" className="cursor-pointer flex flex-col items-center justify-center w-24 h-24 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                 <FaImage className="text-gray-400 text-2xl mb-1" />
                 <span className="text-[10px] text-gray-500 font-medium">Cambiar</span>
                 <input type="file" name="file_proyecto" id="file_proyecto" accept="image/*" onChange={handleCoverChange} className="hidden" />
              </label>
              {imagePreviewUrl ? (
                <img src={imagePreviewUrl} alt="Portada" className="w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm" />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">Sin imagen</div>
              )}
            </div>
          </div>

          {/* Columna Derecha: Subida de Galería */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Añadir a Galería</label>
            <label htmlFor="gallery_files" className="cursor-pointer flex flex-col items-center justify-center w-full h-24 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <FaCloudUploadAlt className="text-blue-500 text-2xl mb-1" />
              <span className="text-xs text-gray-600 font-medium">Click para subir fotos/videos</span>
              <span className="text-[10px] text-gray-400">Múltiples archivos permitidos</span>
              <input id="gallery_files" name="gallery_files" type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleGalleryChange} />
            </label>
            
            {/* Previsualización de carga */}
            {pendingFiles.length > 0 && (
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                 {pendingFiles.map((url, i) => (
                   <img key={i} src={url} className="w-8 h-8 rounded object-cover border border-gray-300" alt="prev" />
                 ))}
                 <span className="text-xs text-blue-600 self-center">+{pendingFiles.length} nuevos</span>
              </div>
            )}
          </div>
        </div>

        {/* --- GALERÍA EXISTENTE (Compacta) --- */}
        {currentGallery.length > 0 && (
          <div>
             <p className="text-xs font-bold text-gray-500 uppercase mb-2">Galería Actual ({currentGallery.length})</p>
             <div className="flex gap-3 overflow-x-auto pb-2">
              {currentGallery.map((item) => (
                <div key={item.id} className="relative group flex-shrink-0 w-20 h-20 bg-black rounded-md overflow-hidden">
                  {item.tipo === 'video' ? (
                    <video src={item.url} className="w-full h-full object-cover opacity-60" />
                  ) : (
                    <img src={item.url} alt="img" className="w-full h-full object-cover" />
                  )}
                  <button type="button" onClick={() => handleDeleteGalleryItem(item.id, item.url)} className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity text-white">
                    <FaTrash size={14} />
                  </button>
                </div>
              ))}
             </div>
          </div>
        )}
        
        {/* --- FILA 3: URLs --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
             <label className="block text-xs font-bold text-gray-600 uppercase mb-1">URL Demo</label>
             <input type="url" name="url_demo" className="form-input w-full rounded-md border-gray-300 text-sm py-2" placeholder="https://..." defaultValue={project?.url_demo || ''}/>
           </div>
           <div>
             <label className="block text-xs font-bold text-gray-600 uppercase mb-1">URL GitHub</label>
             <input type="url" name="url_github" required className="form-input w-full rounded-md border-gray-300 text-sm py-2" placeholder="https://..." defaultValue={project?.url_github}/>
           </div>
        </div>

        {/* --- FILA 4: Estado y Botón --- */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-4">
          <label className="flex items-center space-x-2 cursor-pointer select-none">
            <input type="checkbox" name="estado" className="form-checkbox h-4 w-4 rounded text-blue-600 border-gray-300" defaultChecked={project?.estado ?? true} />
            <span className="text-sm font-semibold text-gray-700">Visible al público</span>
          </label>

          <div className="w-48">
             <SubmitButton isEditing={isEditing} />
          </div>
        </div>

        {/* Mensajes */}
        {state?.message && (
          <div className={`text-xs p-2 rounded text-center font-medium ${ state.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600' }`}>
            {state.message}
          </div>
        )}
      </form>
    </div>
  );
}