"use server";

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// --- ACCIONES PARA PROYECTOS ---
export async function upsertProject(prevState: any, formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const projectId = formData.get('id') as string;
  
  const data = {
    titulo: formData.get('titulo') as string,
    descripcion: formData.get('descripcion') as string,
    url_demo: formData.get('url_demo') as string,
    url_github: formData.get('url_github') as string,
    tecnologias: (formData.get('tecnologias') as string)
      .split(',')
      .map(tech => tech.trim()),
  };

  if (!data.titulo || !data.descripcion || !data.tecnologias || !data.url_github) {
    return { message: 'Todos los campos obligatorios deben ser llenados.' };
  }
  let query = supabase.from('proyectos');
  
  if (projectId) {
    const { error } = await query
      .update({
        titulo: data.titulo,
        descripcion: data.descripcion,
        tecnologias: data.tecnologias,
        url_demo: data.url_demo || null,
        url_github: data.url_github,
      })
      .eq('id', projectId);
    
    if (error) {
        console.error('Error al actualizar proyecto:', error);
        return { message: `Error al actualizar: ${error.message}` };
    }

  } else {
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
      
    if (error) {
      console.error('Error al crear proyecto:', error);
      return { message: `Error al guardar: ${error.message}` };
    }
  }

  revalidatePath('/admin/proyectos'); 
  revalidatePath('/'); 
  
  redirect('/admin/proyectos');
}
export async function deleteProject(id: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  if (!id) {
    return { success: false, message: 'ID de proyecto no proporcionado.' };
  }
  const { error } = await supabase
    .from('proyectos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al borrar proyecto:', error);
    return { success: false, message: `Error al borrar: ${error.message}` };
  }

  revalidatePath('/admin/proyectos'); 
  revalidatePath('/'); 
  
  return { success: true, message: 'Proyecto eliminado con éxito.' };
}

// --- ACCIONES PARA EXPERIENCIA ---
export async function upsertExperience(prevState: any, formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const experienceId = formData.get('id') as string | null;
  
  const data = {
    puesto: formData.get('puesto') as string,
    empresa: formData.get('empresa') as string,
    fecha_inicio: formData.get('fecha_inicio') as string,
    fecha_fin: (formData.get('fecha_fin') as string) || null,
    descripcion: formData.get('descripcion') as string,
  };

  if (!data.puesto || !data.empresa || !data.fecha_inicio || !data.descripcion) {
    return { message: 'Todos los campos obligatorios deben ser llenados.' };
  }

  let query = supabase.from('experiencia');
  
  if (experienceId) {
    const { error } = await query
      .update({
        puesto: data.puesto,
        empresa: data.empresa,
        fecha_inicio: data.fecha_inicio,
        fecha_fin: data.fecha_fin,
        descripcion: data.descripcion,
      })
      .eq('id', experienceId);
    
    if (error) {
        console.error('Error al actualizar experiencia:', error);
        return { message: `Error al actualizar: ${error.message}` };
    }

  } else {
    const { error } = await query
      .insert([
        {
          puesto: data.puesto,
          empresa: data.empresa,
          fecha_inicio: data.fecha_inicio,
          fecha_fin: data.fecha_fin,
          descripcion: data.descripcion,
        }
      ]);
      
    if (error) {
      console.error('Error al crear experiencia:', error);
      return { message: `Error al guardar: ${error.message}` };
    }
  }

  revalidatePath('/admin/experiencia'); 
  revalidatePath('/'); 
  
  redirect('/admin/experiencia');
}
export async function deleteExperience(id: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  // 1. Validar que el ID exista
  if (!id) {
    return { success: false, message: 'ID de experiencia no proporcionado.' };
  }

  // 2. Ejecutar el borrado en la tabla 'experiencia'
  const { error } = await supabase
    .from('experiencia')
    .delete()
    .eq('id', id); // <--- Condición para borrar SOLO ese ID

  // 3. Manejar error
  if (error) {
    console.error('Error al borrar experiencia:', error);
    return { success: false, message: `Error al borrar: ${error.message}` };
  }

  // 4. Éxito: Limpiar la caché
  revalidatePath('/admin/experiencia'); 
  revalidatePath('/'); // También limpiar el portafolio público
  
  return { success: true, message: 'Experiencia eliminada con éxito.' };
}

// --- ACCIONES PARA EDUCACIÓN ---
export async function upsertEducation(prevState: any, formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // 1. Obtener y parsear los datos
  const educationId = formData.get('id') as string | null;
  
  const data = {
    titulo: formData.get('titulo') as string,
    institucion: formData.get('institucion') as string,
    fecha_inicio: formData.get('fecha_inicio') as string,
    fecha_fin: (formData.get('fecha_fin') as string) || null,
  };

  // 2. Validar
  if (!data.titulo || !data.institucion || !data.fecha_inicio) {
    return { message: 'Todos los campos obligatorios deben ser llenados.' };
  }

  // 3. Lógica de Upsert
  let query = supabase.from('educacion');
  
  if (educationId) {
    // UPDATE
    const { error } = await query
      .update({ ...data })
      .eq('id', educationId);
    
    if (error) {
        console.error('Error al actualizar educación:', error);
        return { message: `Error al actualizar: ${error.message}` };
    }

  } else {
    // INSERT
    const { error } = await query
      .insert([
        { ...data }
      ]);
      
    if (error) {
      console.error('Error al crear educación:', error);
      return { message: `Error al guardar: ${error.message}` };
    }
  }

  // 5. Éxito: Limpiar la caché y redirigir
  revalidatePath('/admin/educacion');
  revalidatePath('/');
  redirect('/admin/educacion');
}
export async function deleteEducation(id: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  if (!id) {
    return { success: false, message: 'ID de educación no proporcionado.' };
  }

  const { error } = await supabase
    .from('educacion')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al borrar educación:', error);
    return { success: false, message: `Error al borrar: ${error.message}` };
  }

  revalidatePath('/admin/educacion'); 
  revalidatePath('/');
  
  return { success: true, message: 'Educación eliminada con éxito.' };
}

// --- ACCIONES PARA HABILIDADES ---
export async function upsertSkill(prevState: any, formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // 1. Obtener y parsear los datos
  const skillId = formData.get('id') as string | null;
  
  const data = {
    nombre: formData.get('nombre') as string,
    tipo: (formData.get('tipo') as string) || null, // Campo opcional
  };

  // 2. Validar
  if (!data.nombre) {
    return { message: 'El campo "Nombre" es obligatorio.' };
  }

  // 3. Lógica de Upsert
  let query = supabase.from('habilidades');
  
  if (skillId) {
    // UPDATE
    const { error } = await query
      .update({ ...data })
      .eq('id', skillId);
    
    if (error) {
        console.error('Error al actualizar habilidad:', error);
        // Manejo de error de Supabase para nombre único
        if (error.code === '23505') { // Código de violación de unicidad
            return { message: 'Error: Ya existe una habilidad con ese nombre.' };
        }
        return { message: `Error al actualizar: ${error.message}` };
    }

  } else {
    // INSERT
    const { error } = await query
      .insert([
        { ...data }
      ]);
      
    if (error) {
      console.error('Error al crear habilidad:', error);
      if (error.code === '23505') {
          return { message: 'Error: Ya existe una habilidad con ese nombre.' };
      }
      return { message: `Error al guardar: ${error.message}` };
    }
  }

  // 5. Éxito: Limpiar la caché y redirigir
  revalidatePath('/admin/habilidades');
  revalidatePath('/');
  redirect('/admin/habilidades');
}
export async function deleteSkill(id: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  if (!id) {
    return { success: false, message: 'ID de habilidad no proporcionado.' };
  }

  const { error } = await supabase
    .from('habilidades')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al borrar habilidad:', error);
    return { success: false, message: `Error al borrar: ${error.message}` };
  }

  revalidatePath('/admin/habilidades'); 
  revalidatePath('/');
  
  return { success: true, message: 'Habilidad eliminada con éxito.' };
}
// --- ACCIÓN PARA PERFIL (SOBRE MÍ) ---
export async function updateProfile(prevState: any, formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // 1. Obtener y parsear los datos del formulario
  const data = {
    nombre_completo: formData.get('nombre_completo') as string,
    titulo: formData.get('titulo') as string,
    ubicacion: formData.get('ubicacion') as string,
    acerca_de: formData.get('acerca_de') as string,
    url_foto_perfil: formData.get('url_foto_perfil') as string,
  };

  // 2. Validar
  if (!data.nombre_completo || !data.titulo || !data.acerca_de) {
    return { success: false, message: 'Nombre, Título y Acerca de son obligatorios.' };
  }

  // 3. Lógica de Actualización
  // Actualizamos la fila DONDE EL ID SEA EL QUE YA CONOCEMOS
  // (Como solo hay una fila, podemos usar un ID fijo o .limit(1))
  // Lo más seguro es obtener el ID de la fila
  const { data: profileData } = await supabase.from('perfil').select('id').limit(1).single();
  
  if (!profileData) {
    return { success: false, message: 'No se encontró el perfil para actualizar.' };
  }

  const { error } = await supabase
    .from('perfil')
    .update({
      nombre_completo: data.nombre_completo,
      titulo: data.titulo,
      ubicacion: data.ubicacion,
      acerca_de: data.acerca_de,
      url_foto_perfil: data.url_foto_perfil || null,
    })
    .eq('id', profileData.id); // <-- Actualiza solo esa fila

  // 4. Manejar errores
  if (error) {
    console.error('Error al actualizar perfil:', error);
    return { success: false, message: `Error al actualizar: ${error.message}` };
  }

  // 5. Éxito: Limpiar la caché y redirigir
  revalidatePath('/admin/sobre-mi'); // Limpia caché del admin
  revalidatePath('/'); // Limpia caché de la página principal
  
  // No redirigimos, solo mostramos un mensaje de éxito
  return { success: true, message: '¡Perfil actualizado con éxito!' };
}