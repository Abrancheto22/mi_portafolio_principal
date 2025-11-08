"use server";

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Renombramos la función para que maneje tanto la Creación como la Actualización (Upsert)
export async function upsertProject(prevState: any, formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // 1. Obtener y parsear los datos del formulario, incluyendo el ID
  const projectId = formData.get('id') as string; // Será null/vacío si es CREAR
  
  const data = {
    titulo: formData.get('titulo') as string,
    descripcion: formData.get('descripcion') as string,
    url_demo: formData.get('url_demo') as string,
    url_github: formData.get('url_github') as string,
    // Convertimos el string "React, Next.js" en un array {"React", "Next.js"}
    tecnologias: (formData.get('tecnologias') as string)
      .split(',')
      .map(tech => tech.trim()),
  };

  // 2. Validar
  if (!data.titulo || !data.descripcion || !data.tecnologias || !data.url_github) {
    return { message: 'Todos los campos obligatorios deben ser llenados.' };
  }

  // 3. LÓGICA DE ACTUALIZACIÓN VS CREACIÓN
  let query = supabase.from('portafolio');
  
  if (projectId) {
    // Si tenemos un ID, es ACTUALIZACIÓN (UPDATE)
    const { error } = await query
      .update({
        titulo: data.titulo,
        descripcion: data.descripcion,
        tecnologias: data.tecnologias,
        url_demo: data.url_demo || null,
        url_github: data.url_github,
      })
      .eq('id', projectId); // <--- Condición para actualizar solo ese ID
    
    // 4. Manejar errores
    if (error) {
        console.error('Error al actualizar proyecto:', error);
        return { message: `Error al actualizar: ${error.message}` };
    }

  } else {
    // Si NO tenemos ID, es CREACIÓN (INSERT)
    const { error } = await query
      .insert([
        {
          titulo: data.titulo,
          descripcion: data.descripcion,
          tecnologias: data.tecnologias,
          url_demo: data.url_demo || null,
          url_github: data.url_github,
        }
      ]);
      
    // 4. Manejar errores
    if (error) {
      console.error('Error al crear proyecto:', error);
      return { message: `Error al guardar: ${error.message}` };
    }
  }

  // 5. Éxito: Limpiar la caché y redirigir
  revalidatePath('/admin/proyectos'); // Limpia caché de la tabla
  revalidatePath('/'); // Limpia caché de la página principal
  
  // Redirige al usuario de vuelta a la tabla de proyectos
  redirect('/admin/proyectos');
}

// --- FUNCIÓN DE BORRADO (DELETE) ---
export async function deleteProject(id: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  // 1. Validar que el ID exista
  if (!id) {
    return { success: false, message: 'ID de proyecto no proporcionado.' };
  }

  // 2. Ejecutar el borrado en Supabase
  const { error } = await supabase
    .from('portafolio')
    .delete()
    .eq('id', id); // <--- Condición para borrar SOLO ese ID

  // 3. Manejar error
  if (error) {
    console.error('Error al borrar proyecto:', error);
    return { success: false, message: `Error al borrar: ${error.message}` };
  }

  // 4. Éxito: Limpiar la caché y redirigir a la tabla
  revalidatePath('/admin/proyectos'); 
  revalidatePath('/'); // También limpiar el portafolio público
  
  // No redirigimos aquí; el componente cliente lo manejará.
  return { success: true, message: 'Proyecto eliminado con éxito.' };
}