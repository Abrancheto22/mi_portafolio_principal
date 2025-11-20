"use server";

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Resend } from 'resend';

// --- ACCIONES PARA PROYECTOS ---
export async function upsertProject(prevState: any, formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const projectId = formData.get('id') as string | null;
  
  // 1. Datos básicos y Portada (Igual que antes)
  const filePortada = formData.get('file_proyecto') as File;
  const galleryFiles = formData.getAll('gallery_files') as File[]; // <-- ¡NUEVO! Obtenemos array
  
  const data = {
    titulo: formData.get('titulo') as string,
    descripcion: formData.get('descripcion') as string,
    url_demo: formData.get('url_demo') as string,
    url_github: formData.get('url_github') as string,
    tecnologias: (formData.get('tecnologias') as string).split(',').map(t => t.trim()),
    image_url: formData.get('image_url_existente') as string,
    estado: formData.get('estado') === 'on' ? true : false,
  };

  // Validaciones básicas...
  if (!data.titulo || !data.descripcion) return { success: false, message: 'Faltan datos.' };

  // --- A. SUBIDA DE PORTADA (Lógica existente) ---
  if (filePortada && filePortada.size > 0) {
     // ... (Tu código actual para subir la portada a 'image_url') ...
     // Copia aquí tu bloque existente de subida de portada
     const ext = filePortada.name.split('.').pop();
     const fileName = `cover-${crypto.randomUUID()}.${ext}`;
     const { data: uploadData, error: uploadError } = await supabase.storage
        .from('portafolio-images').upload(`proyectos/${fileName}`, filePortada);
     if (!uploadError) {
        const { data: publicUrl } = supabase.storage.from('portafolio-images').getPublicUrl(`proyectos/${fileName}`);
        data.image_url = publicUrl.publicUrl;
     }
  }

  // --- B. GUARDAR PROYECTO (INSERT o UPDATE) ---
  let currentProjectId = projectId;
  let query = supabase.from('proyectos');
  
  // Preparamos el objeto a guardar
  const projectPayload = {
    titulo: data.titulo,
    descripcion: data.descripcion,
    tecnologias: data.tecnologias,
    url_demo: data.url_demo || null,
    url_github: data.url_github,
    image_url: data.image_url || null,
    estado: data.estado
  };

  if (currentProjectId) {
    // UPDATE
    const { error } = await query.update(projectPayload).eq('id', currentProjectId);
    if (error) return { success: false, message: error.message };
  } else {
    // INSERT (Necesitamos recuperar el ID del nuevo proyecto para la galería)
    const { data: newProject, error } = await query.insert([projectPayload]).select().single();
    if (error) return { success: false, message: error.message };
    currentProjectId = newProject.id; // Capturamos el nuevo ID
  }

  // --- C. SUBIDA DE GALERÍA (¡LO NUEVO!) ---
  // Solo si tenemos un ID de proyecto válido y archivos en la galería
  if (currentProjectId && galleryFiles && galleryFiles.length > 0) {
    
    // Filtramos archivos vacíos (por si acaso)
    const validFiles = galleryFiles.filter(f => f.size > 0);

    for (const file of validFiles) {
      // 1. Detectar tipo (Imagen o Video)
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      if (!isImage && !isVideo) continue; // Saltar archivos no válidos

      const tipo = isImage ? 'imagen' : 'video';
      const ext = file.name.split('.').pop();
      const fileName = `gallery-${currentProjectId}-${crypto.randomUUID()}.${ext}`;
      
      // 2. Subir a Storage
      const { error: uploadError } = await supabase.storage
        .from('portafolio-images')
        .upload(`proyectos/galeria/${fileName}`, file);

      if (!uploadError) {
        // 3. Obtener URL
        const { data: publicUrl } = supabase.storage
          .from('portafolio-images')
          .getPublicUrl(`proyectos/galeria/${fileName}`);

        // 4. Insertar en la tabla 'proyecto_multimedia'
        await supabase.from('proyecto_multimedia').insert({
          proyecto_id: currentProjectId,
          url: publicUrl.publicUrl,
          tipo: tipo
        });
      }
    }
  }

  revalidatePath('/admin/proyectos');
  revalidatePath('/');
  return { success: true, message: 'Proyecto guardado con galería.' };
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
    estado: formData.get('estado') === 'on' ? true : false,
  };

  if (!data.puesto || !data.empresa || !data.fecha_inicio || !data.descripcion) {
    return { success: false, message: 'Todos los campos obligatorios deben ser llenados.' };
  }
  
  let query = supabase.from('experiencia');
  if (experienceId) {
    const { error } = await query.update({ ...data }).eq('id', experienceId);
    if (error) {
        console.error('Error al actualizar experiencia:', error);
        return { success: false, message: `Error al actualizar: ${error.message}` };
    }
  } else {
    const { error } = await query.insert([{ ...data }]);
    if (error) {
      console.error('Error al crear experiencia:', error);
      return { success: false, message: `Error al guardar: ${error.message}` };
    }
  }

  revalidatePath('/admin/experiencia'); 
  revalidatePath('/'); 
  return { success: true, message: experienceId ? 'Experiencia actualizada.' : 'Experiencia creada.' };
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
  const educationId = formData.get('id') as string | null;
  const data = {
    titulo: formData.get('titulo') as string,
    institucion: formData.get('institucion') as string,
    fecha_inicio: formData.get('fecha_inicio') as string,
    fecha_fin: (formData.get('fecha_fin') as string) || null,
    estado: formData.get('estado') === 'on' ? true : false,
  };

  if (!data.titulo || !data.institucion || !data.fecha_inicio) {
    return { success: false, message: 'Todos los campos obligatorios deben ser llenados.' };
  }
  
  let query = supabase.from('educacion');
  if (educationId) {
    const { error } = await query.update({ ...data }).eq('id', educationId);
    if (error) {
        console.error('Error al actualizar educación:', error);
        return { success: false, message: `Error al actualizar: ${error.message}` };
    }
  } else {
    const { error } = await query.insert([{ ...data }]);
    if (error) {
      console.error('Error al crear educación:', error);
      return { success: false, message: `Error al guardar: ${error.message}` };
    }
  }
  
  revalidatePath('/admin/educacion');
  revalidatePath('/');
  return { success: true, message: educationId ? 'Educación actualizada.' : 'Educación creada.' };
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
  const skillId = formData.get('id') as string | null;
  const data = {
    nombre: formData.get('nombre') as string,
    tipo: (formData.get('tipo') as string) || null,
    estado: formData.get('estado') === 'on' ? true : false,
  };

  if (!data.nombre) {
    return { success: false, message: 'El campo "Nombre" es obligatorio.' };
  }

  let query = supabase.from('habilidades');
  if (skillId) {
    const { error } = await query.update({ ...data }).eq('id', skillId);
    if (error) {
        console.error('Error al actualizar habilidad:', error);
        if (error.code === '23505') return { success: false, message: 'Error: Ya existe una habilidad con ese nombre.' };
        return { success: false, message: `Error al actualizar: ${error.message}` };
    }
  } else {
    const { error } = await query.insert([{ ...data }]);
    if (error) {
      console.error('Error al crear habilidad:', error);
      if (error.code === '23505') return { success: false, message: 'Error: Ya existe una habilidad con ese nombre.' };
      return { success: false, message: `Error al guardar: ${error.message}` };
    }
  }

  revalidatePath('/admin/habilidades');
  revalidatePath('/');
  return { success: true, message: skillId ? 'Habilidad actualizada.' : 'Habilidad creada.' };
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

// --- ACCIONES PARA REDES SOCIALES ---
export async function upsertSocialLink(prevState: any, formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const socialId = formData.get('id') as string | null;
  const data = {
    nombre: formData.get('nombre') as string,
    url: formData.get('url') as string,
    estado: formData.get('estado') === 'on' ? true : false, 
  };

  if (!data.nombre || !data.url) {
    return { success: false, message: 'Todos los campos son obligatorios.' };
  }

  let query = supabase.from('redes_sociales');
  if (socialId) {
    const { error } = await query.update({ ...data }).eq('id', socialId);
    if (error) {
      if (error.code === '23505') return { success: false, message: 'Error: Ya existe una red con ese nombre.' };
      return { success: false, message: `Error al actualizar: ${error.message}` };
    }
  } else {
    const { error } = await query.insert([{ ...data }]);
    if (error) {
      if (error.code === '23505') return { success: false, message: 'Error: Ya existe una red con ese nombre.' };
      return { success: false, message: `Error al guardar: ${error.message}` };
    }
  }

  revalidatePath('/admin/redes');
  revalidatePath('/');
  return { success: true, message: socialId ? 'Red social actualizada.' : 'Red social creada.' };
}
export async function deleteSocialLink(id: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  if (!id) {
    return { success: false, message: 'ID de red social no proporcionado.' };
  }

  const { error } = await supabase
    .from('redes_sociales')
    .delete()
    .eq('id', id);

  if (error) {
    return { success: false, message: `Error al borrar: ${error.message}` };
  }

  revalidatePath('/admin/redes'); 
  revalidatePath('/');
  return { success: true, message: 'Red social eliminada con éxito.' };
}

// --- ACCIÓN PARA PERFIL (SOBRE MÍ) ---
export async function updateProfile(prevState: any, formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // 1. Obtener todos los datos del formulario
  const data = {
    nombre_completo: formData.get('nombre_completo') as string,
    titulo: formData.get('titulo') as string,
    ubicacion: formData.get('ubicacion') as string,
    acerca_de: formData.get('acerca_de') as string,
    // Dejamos la URL vacía por ahora, la llenaremos si se sube una imagen
    url_foto_perfil: formData.get('url_foto_perfil_existente') as string, 
  };
  const file = formData.get('file_foto_perfil') as File;

  // 2. Validar texto
  if (!data.nombre_completo || !data.titulo || !data.acerca_de) {
    return { success: false, message: 'Nombre, Título y Acerca de son obligatorios.' };
  }

  // 3. LÓGICA DE SUBIDA DE IMAGEN (SI HAY UN ARCHIVO NUEVO)
  if (file && file.size > 0) {
    // 3.1. Validar tipo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, message: 'Tipo de archivo no permitido (Solo JPG, PNG, WEBP).' };
    }

    // 3.2. Subir el archivo
    const fileExtension = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExtension}`;
    const filePath = `images/perfil/${fileName}`; // Carpeta 'perfil'

    const { error: uploadError } = await supabase.storage
      .from('portafolio-images') // Tu bucket
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Error al subir imagen:', uploadError);
      return { success: false, message: `Error al subir imagen: ${uploadError.message}` };
    }

    // 3.3. Obtener la URL pública y asignarla a 'data'
    const { data: publicUrlData } = supabase.storage
      .from('portafolio-images')
      .getPublicUrl(filePath);
      
    data.url_foto_perfil = publicUrlData.publicUrl;

  } // Fin de la lógica de subida

  // 4. Lógica de Actualización de Perfil (con la URL de imagen nueva o la existente)
  const { data: profileData } = await supabase.from('perfil').select('id').limit(1).single();
  if (!profileData) {
    return { success: false, message: 'No se encontró el perfil para actualizar.' };
  }

  const { error: updateError } = await supabase
    .from('perfil')
    .update({
      nombre_completo: data.nombre_completo,
      titulo: data.titulo,
      ubicacion: data.ubicacion,
      acerca_de: data.acerca_de,
      url_foto_perfil: data.url_foto_perfil || null,
    })
    .eq('id', profileData.id);

  if (updateError) {
    console.error('Error al actualizar perfil:', updateError);
    return { success: false, message: `Error al actualizar: ${updateError.message}` };
  }

  // 5. Éxito
  revalidatePath('/admin/sobre-mi'); 
  revalidatePath('/');
  
  return { success: true, message: '¡Perfil actualizado con éxito!' };
}

// --- FUNCIÓN PARA SUBIR IMAGEN A SUPABASE STORAGE ---
export async function uploadImage(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const file = formData.get('file') as File; // Obtenemos el archivo

  if (!file || file.size === 0) {
    return { success: false, message: 'No se ha proporcionado ningún archivo.' };
  }

  // 1. Validar tipo de archivo (opcional pero recomendado)
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { success: false, message: 'Tipo de archivo no permitido. Solo JPG, PNG, WEBP.' };
  }

  // 2. Generar un nombre único para el archivo
  // Usaremos un UUID para evitar colisiones y mantener los nombres limpios
  const fileExtension = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExtension}`; // crypto.randomUUID() es de Node.js

  // 3. Ruta de subida en el bucket
  // Puedes organizar en carpetas: 'proyectos/imagen.jpg', 'perfil/foto.png'
  // Por ahora, lo subimos directamente a la raíz del bucket 'portafolio-images'
  const filePath = `images/${fileName}`; 

  // 4. Subir el archivo al Storage
  const { data, error } = await supabase.storage
    .from('portafolio-images') // <-- Nombre de tu bucket
    .upload(filePath, file, {
      cacheControl: '3600', // Caché por una hora
      upsert: false, // No sobrescribir si ya existe
    });

  if (error) {
    console.error('Error al subir imagen:', error);
    return { success: false, message: `Error al subir imagen: ${error.message}` };
  }

  // 5. Obtener la URL pública de la imagen
  const { data: publicUrlData } = supabase.storage
    .from('portafolio-images')
    .getPublicUrl(filePath);

  if (!publicUrlData || !publicUrlData.publicUrl) {
    return { success: false, message: 'No se pudo obtener la URL pública de la imagen.' };
  }

  return { success: true, url: publicUrlData.publicUrl, message: 'Imagen subida con éxito.' };
}

// --- ACCIÓN PARA FORMULARIO DE CONTACTO ---
export async function sendContactEmail(prevState: any, formData: FormData) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  // 2. Obtener los datos del formulario
  const name = formData.get('name') as string;
  const senderEmail = formData.get('email') as string;
  const message = formData.get('message') as string;

  // 3. Validar (simple)
  if (!name || !senderEmail || !message) {
    return { success: false, message: 'Por favor, completa todos los campos.' };
  }
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'Portafolio <onboarding@resend.dev>',
      to: ['abraham_benj18@hotmail.com'],
      subject: `Nuevo Mensaje de Portafolio de: ${name}`,
      text: `De: ${name} (${senderEmail})\n\nMensaje:\n${message}`,
    });

    if (error) {
      console.error("Error al enviar correo:", error);
      return { success: false, message: `Error al enviar: ${error.message}` };
    }

    return { success: true, message: '¡Mensaje enviado con éxito!' };

  } catch (exception) {
    console.error(exception);
    return { success: false, message: 'Ocurrió un error inesperado.' };
  }
}

// --- BORRAR ITEM DE GALERÍA ---
export async function deleteGalleryItem(itemId: string, itemUrl: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // 1. Borrar de la Base de Datos
  const { error: dbError } = await supabase
    .from('proyecto_multimedia')
    .delete()
    .eq('id', itemId);

  if (dbError) {
    return { success: false, message: `Error al borrar de DB: ${dbError.message}` };
  }

  // 2. Borrar del Storage (limpieza del archivo físico)
  const path = itemUrl.split('/portafolio-images/').pop();
  if (path) {
    await supabase.storage.from('portafolio-images').remove([path]);
  }

  revalidatePath('/admin/proyectos');
  return { success: true, message: 'Archivo eliminado.' };
}